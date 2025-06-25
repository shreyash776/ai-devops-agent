import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function analyzeRepo(repoUrl: string) {
  // Extract owner and repo name from URL
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub repo URL');
  const [_, owner, repo] = match;

  // Get repo details
  const { data } = await octokit.repos.get({ owner, repo });

  // Example: get language stats
  const { data: langs } = await octokit.repos.listLanguages({ owner, repo });

  // You can expand this to fetch package.json, Dockerfile, etc.
  return {
    owner,
    repo,
    languages: langs,
    description: data.description,
    default_branch: data.default_branch,
  };
}
