import { analyzeRepo } from './github';
import { generateDockerfile, generateWorkflow } from './filegen';


export async function generateDevOpsFiles(repoUrl: string) {
  
  const analysis = await analyzeRepo(repoUrl);

  // 2. Generate Dockerfile using LLM
  const dockerfile = await generateDockerfile(analysis);

  // 3. Generate GitHub Actions workflow file using LLM
  const workflow = await generateWorkflow(analysis);

  return {
    dockerfile,
    workflow,
    analysis,
  };
}
