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

  // 1. Get the authenticated user's login
  const { data: user } = await octokit.users.getAuthenticated();
  const myLogin = user.login;

  // 2. Check if user has push access to the repo
  let useFork = true;
  try {
    const { data: repoData } = await octokit.repos.get({ owner, repo });
    if (repoData.permissions && repoData.permissions.push) {
      useFork = false;
    }
  } catch (err) {
    // If repo is not accessible, fallback to fork
    useFork = true;
  }

  let targetOwner = owner;
  let targetRepo = repo;

  // 3. Fork if needed
  if (useFork) {
    // Fork the repo (if not already forked)
    const { data: fork } = await octokit.repos.createFork({ owner, repo });
    targetOwner = fork.owner.login;
    targetRepo = fork.name;

    // Wait for fork to be ready
    let forkReady = false;
    let forkDefaultBranch = fork.default_branch;
    for (let i = 0; i < 10; i++) {
      try {
        const { data: forkRepo } = await octokit.repos.get({ owner: targetOwner, repo: targetRepo });
        forkDefaultBranch = forkRepo.default_branch;
        forkReady = true;
        break;
      } catch {
        await new Promise(res => setTimeout(res, 2000));
      }
    }
    if (!forkReady) throw new Error('Fork not ready. Try again later.');
  }

  // 4. Get latest commit SHA from target repo's default branch
  const { data: repoData } = await octokit.repos.get({ owner: targetOwner, repo: targetRepo });
  const baseBranch = repoData.default_branch;
  const { data: refData } = await octokit.git.getRef({
    owner: targetOwner,
    repo: targetRepo,
    ref: `heads/${baseBranch}`,
  });
  const latestCommitSha = refData.object.sha;

  // 5. Create a new branch in the target repo (fork or original)
  const branchName = `ai-generated/${filePath.replace(/\W+/g, '-').toLowerCase()}-${Date.now()}`;
  await octokit.git.createRef({
    owner: targetOwner,
    repo: targetRepo,
    ref: `refs/heads/${branchName}`,
    sha: latestCommitSha,
  });

  // 6. Get tree SHA
  const { data: commitData } = await octokit.git.getCommit({
    owner: targetOwner,
    repo: targetRepo,
    commit_sha: latestCommitSha,
  });
  const treeSha = commitData.tree.sha;

  // 7. Create blob for file
  const { data: blobData } = await octokit.git.createBlob({
    owner: targetOwner,
    repo: targetRepo,
    content: fileContent,
    encoding: 'utf-8',
  });

  // 8. Create new tree
  const { data: newTree } = await octokit.git.createTree({
    owner: targetOwner,
    repo: targetRepo,
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

  // 9. Create commit
  const { data: newCommit } = await octokit.git.createCommit({
    owner: targetOwner,
    repo: targetRepo,
    message: commitMessage,
    tree: newTree.sha,
    parents: [latestCommitSha],
  });

  // 10. Update branch to point to new commit
  await octokit.git.updateRef({
    owner: targetOwner,
    repo: targetRepo,
    ref: `heads/${branchName}`,
    sha: newCommit.sha,
  });

  // 11. Create PR (from fork if needed)
  const prHead = useFork ? `${myLogin}:${branchName}` : branchName;
  const { data: pr } = await octokit.pulls.create({
    owner,
    repo,
    title: prTitle,
    body: prBody,
    head: prHead,
    base: baseBranch,
  });

  return pr.html_url;
}
