import { analyzeRepo } from './github';
import { generateDockerfile, generateWorkflow } from './filegen';

export async function generateDevOpsFiles(repoUrl: string) {
  const analysis = await analyzeRepo(repoUrl);
  const dockerfile = await generateDockerfile(analysis);
  const workflow = await generateWorkflow(analysis);
  return { dockerfile, workflow, analysis };
}

// Add these helpers for single artifact generation:
export async function generateDockerfileForRepo(repoUrl: string) {
  const analysis = await analyzeRepo(repoUrl);
  const dockerfile = await generateDockerfile(analysis);
  return { dockerfile, analysis };
}

export async function generateWorkflowForRepo(repoUrl: string) {
  const analysis = await analyzeRepo(repoUrl);
  const workflow = await generateWorkflow(analysis);
  return { workflow, analysis };
}
 