// import { ChatOpenAI } from '@langchain/openai';

// const llm = new ChatOpenAI({
//   openAIApiKey: process.env.OPENAI_API_KEY,
//   modelName: 'gpt-4',
// });

// export async function generateDockerfile(analysis: any) {
//   const prompt = `
// You are an expert DevOps engineer. Generate a production-ready Dockerfile for a project with these details:
// Languages: ${Object.keys(analysis.languages).join(', ')}
// Description: ${analysis.description}
// Respond with only the Dockerfile content.
//   `;
//   const res = await llm.invoke(prompt);
//   return res.content;
// }

// export async function generateWorkflow(analysis: any) {
//   const prompt = `
// You are an expert in CI/CD. Generate a GitHub Actions workflow YAML for building and testing a project with these details:
// Languages: ${Object.keys(analysis.languages).join(', ')}
// Default branch: ${analysis.default_branch}
// Respond with only the YAML content.
//   `;
//   const res = await llm.invoke(prompt);
//   return res.content;
// }

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/**
 * Removes markdown code fences from LLM output.
 */
function cleanMarkdownResponse(content: string): string {
  if (!content) return "";
  // Removes `````` and ``````
  return content.replace(/``````/g, "$1").trim();
}

/**
 * Extracts plain text from Gemini LLM response (handles string, object, and array cases).
 */
function extractTextContent(res: any): string {
  if (!res) return "";
  if (typeof res === "string") return res.trim();
  if (typeof res.content === "string") return res.content.trim();
  if (Array.isArray(res)) return res.map(extractTextContent).join("\n").trim();
  if (Array.isArray(res.content)) return res.content.map(extractTextContent).join("\n").trim();
  return JSON.stringify(res);
}

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-001",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.2,
  maxRetries: 3,
});

export async function generateDockerfile(analysis: any): Promise<string> {
  const prompt = `
You are an expert DevOps engineer. Generate a production-ready Dockerfile for a project with these details:
Languages: ${Object.keys(analysis.languages).join(', ')}
Description: ${analysis.description || "No description provided."}
Respond with ONLY the Dockerfile content. DO NOT include any markdown code blocks or extra commentary.
  `.trim();

  try {
    const res = await llm.invoke(prompt);
    const output = extractTextContent(res);
    return cleanMarkdownResponse(output);
  } catch (error) {
    console.error("Error generating Dockerfile:", error);
    return "# Error: Unable to generate Dockerfile.";
  }
}

export async function generateWorkflow(analysis: any): Promise<string> {
  const prompt = `
You are an expert in CI/CD. Generate a GitHub Actions workflow YAML for building and testing a project with these details:
Languages: ${Object.keys(analysis.languages).join(', ')}
Default branch: ${analysis.default_branch}
Respond with ONLY the YAML content. DO NOT include any markdown code blocks or extra commentary.
  `.trim();

  try {
    const res = await llm.invoke(prompt);
    const output = extractTextContent(res);
    return cleanMarkdownResponse(output);
  } catch (error) {
    console.error("Error generating workflow:", error);
    return "# Error: Unable to generate workflow YAML.";
  }
}
