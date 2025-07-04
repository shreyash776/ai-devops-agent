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

export async function createPullRequestWithFile({
  repoUrl,
  filePath,
  fileContent,
  prTitle,
  prBody = '',
  commitMessage = 'Add generated file',
}: {
  repoUrl: string,
  filePath: string,
  fileContent: string,
  prTitle: string,
  prBody?: string,
  commitMessage?: string,
}) {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub repo URL');
  const [_, owner, repo] = match;

  // 1. Get the default branch
  const { data: repoData } = await octokit.repos.get({ owner, repo });
  const baseBranch = repoData.default_branch;

  // 2. Get the latest commit SHA of the base branch
  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`,
  });
  const latestCommitSha = refData.object.sha;

  // 3. Create a new branch
  const branchName = `ai-generated/${filePath.replace(/\W+/g, '-').toLowerCase()}-${Date.now()}`;
  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: latestCommitSha,
  });

  // 4. Get the tree SHA
  const { data: commitData } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: latestCommitSha,
  });
  const treeSha = commitData.tree.sha;

  // 5. Create a blob for the new file
  const { data: blobData } = await octokit.git.createBlob({
    owner,
    repo,
    content: fileContent,
    encoding: 'utf-8',
  });

  // 6. Create a new tree with the file added/updated
  const { data: newTree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: treeSha,
    tree: [
      {
        path: filePath,
        mode: '100644',
        type: 'blob',
        sha: blobData.sha,
      },
    ],
  });

  // 7. Create a new commit
  const { data: newCommit } = await octokit.git.createCommit({
    owner,
    repo,
    message: commitMessage,
    tree: newTree.sha,
    parents: [latestCommitSha],
  });

  // 8. Update the branch to point to the new commit
  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branchName}`,
    sha: newCommit.sha,
  });

  // 9. Create the pull request
  const { data: pr } = await octokit.pulls.create({
    owner,
    repo,
    title: prTitle,
    body: prBody,
    head: branchName,
    base: baseBranch,
  });

  return pr.html_url; // URL to the created PR
}