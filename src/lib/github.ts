import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function analyzeRepo(repoUrl: string) {
 
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub repo URL');
  const [_, owner, repo] = match;

 
  const { data } = await octokit.repos.get({ owner, repo });

  
  const { data: langs } = await octokit.repos.listLanguages({ owner, repo });

  
  async function fetchFile(path: string): Promise<string | null> {
    try {
      const { data: file } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: data.default_branch,
      });
      // file.content is base64 encoded
      // @ts-ignore
      return Buffer.from(file.content, 'base64').toString();
    } catch (err) {
      
      return null;
    }
  }

  
  let packageJson: any = null;
  const packageJsonRaw = await fetchFile('package.json');
  if (packageJsonRaw) {
    try {
      packageJson = JSON.parse(packageJsonRaw);
    } catch {
      packageJson = null;
    }
  }

  const requirementsTxt = await fetchFile('requirements.txt');
  const readme = await fetchFile('README.md');
  const dockerfile = await fetchFile('Dockerfile');
  const makefile = await fetchFile('Makefile');



 
  let fileTree: string[] = [];
  try {
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path: '',
      ref: data.default_branch,
    });
    // @ts-ignore
    fileTree = Array.isArray(contents) ? contents.map((item) => item.path) : [];
  } catch {
    fileTree = [];
  }

  return {
    owner,
    repo,
    languages: langs,
    description: data.description,
    default_branch: data.default_branch,
    packageJson,
    requirementsTxt,
    readme,
    dockerfileContent: dockerfile,
    makefileContent: makefile,
    fileTree,
  };
}
