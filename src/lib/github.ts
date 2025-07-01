// src/lib/github.ts

import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

/**
 * Helper to fetch a file's content from a GitHub repo.
 */
export async function fetchFileFromRepo(repoUrl: string, path: string): Promise<string | null> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub repo URL');
  const [_, owner, repo] = match;
  const { data } = await octokit.repos.get({ owner, repo });
  try {
    const { data: file } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: data.default_branch,
    });
    // @ts-ignore
    return Buffer.from(file.content, 'base64').toString();
  } catch (err) {
    return null;
  }
}

/**
 * Recursively fetches a file tree (top-level and .github/workflows).
 */
async function getFileTree(owner: string, repo: string, ref: string, path = ''): Promise<string[]> {
  try {
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });
    // @ts-ignore
    if (Array.isArray(contents)) {
      let files: string[] = [];
      for (const item of contents) {
        if (item.type === 'dir') {
          // Only go deeper into .github and .github/workflows for now
          if (item.path === '.github' || item.path === '.github/workflows') {
            files = files.concat(await getFileTree(owner, repo, ref, item.path));
          }
        } else if (item.type === 'file') {
          files.push(item.path);
        }
      }
      return files;
    } else if (contents.type === 'file') {
      return [contents.path];
    }
    return [];
  } catch {
    return [];
  }
}

export async function analyzeRepo(repoUrl: string) {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub repo URL');
  const [_, owner, repo] = match;

  // Get repo metadata
  const { data } = await octokit.repos.get({ owner, repo });
  const ref = data.default_branch;

  // Get languages
  const { data: langs } = await octokit.repos.listLanguages({ owner, repo });

  // Fetch main files
  async function fetchFile(path: string): Promise<string | null> {
    try {
      const { data: file } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref,
      });
      // @ts-ignore
      return Buffer.from(file.content, 'base64').toString();
    } catch {
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

  
  const fileTree = await getFileTree(owner, repo, ref);

  
  const workflowFiles = fileTree.filter(f => f.startsWith('.github/workflows/') && f.endsWith('.yml') || f.endsWith('.yaml'));

  
  let workflows: { [filename: string]: string } = {};
  for (const wf of workflowFiles) {
    const content = await fetchFile(wf);
    if (content) workflows[wf] = content;
  }

  return {
    owner,
    repo,
    languages: langs,
    description: data.description,
    default_branch: ref,
    packageJson,
    requirementsTxt,
    readme,
    dockerfileContent: dockerfile,
    makefileContent: makefile,
    fileTree,
    workflowFiles,
    workflows, 
  };
}
