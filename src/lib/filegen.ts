import { ChatOpenAI } from '@langchain/openai';

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4',
});

export async function generateDockerfile(analysis: any) {
  const prompt = `
You are an expert DevOps engineer. Generate a production-ready Dockerfile for a project with these details:
Languages: ${Object.keys(analysis.languages).join(', ')}
Description: ${analysis.description}
Respond with only the Dockerfile content.
  `;
  const res = await llm.invoke(prompt);
  return res.content;
}

export async function generateWorkflow(analysis: any) {
  const prompt = `
You are an expert in CI/CD. Generate a GitHub Actions workflow YAML for building and testing a project with these details:
Languages: ${Object.keys(analysis.languages).join(', ')}
Default branch: ${analysis.default_branch}
Respond with only the YAML content.
  `;
  const res = await llm.invoke(prompt);
  return res.content;
}
