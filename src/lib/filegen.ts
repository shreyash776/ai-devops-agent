import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/**
 * Removes markdown code fences from LLM output.
 */
function cleanMarkdownResponse(content: string): string {
  if (!content) return "";
  // Remove all Markdown code fences (``` or ```
  // This removes lines starting with ```
  return content
    // Remove all Markdown code fences (``` or ```)
    .replace(/^```.*$/gm, "")
    .replace(/```/g, "")        
    .trim();
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
  let prompt = "";

  if (analysis.packageJson) {
    prompt = `
You are an expert DevOps engineer. Generate a production-ready Dockerfile for a Node.js project.
Here is the package.json:
${JSON.stringify(analysis.packageJson, null, 2)}
${analysis.readme ? `\nHere is the README:\n${analysis.readme}` : ""}
Respond with ONLY the Dockerfile content. DO NOT include any markdown code blocks, code fences, or extra commentary.
    `.trim();
  } else if (analysis.requirementsTxt) {
    prompt = `
You are an expert DevOps engineer. Generate a production-ready Dockerfile for a Python project.
Here is the requirements.txt:
${analysis.requirementsTxt}
${analysis.readme ? `\nHere is the README:\n${analysis.readme}` : ""}
Respond with ONLY the Dockerfile content. DO NOT include any markdown code blocks, code fences, or extra commentary.
    `.trim();
  } else {
    prompt = `
You are an expert DevOps engineer. Generate a production-ready Dockerfile for a project with these details:
Languages: ${Object.keys(analysis.languages).join(', ')}
Description: ${analysis.description || "No description provided."}
${analysis.readme ? `\nHere is the README:\n${analysis.readme}` : ""}
Respond with ONLY the Dockerfile content. DO NOT include any markdown code blocks, code fences, or extra commentary.
    `.trim();
  }

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
  let prompt = "";

  if (analysis.packageJson) {
    prompt = `
You are an expert in CI/CD. Generate a GitHub Actions workflow YAML for building and testing a Node.js project.
Here is the package.json:
${JSON.stringify(analysis.packageJson, null, 2)}
Default branch: ${analysis.default_branch}
${analysis.readme ? `\nHere is the README:\n${analysis.readme}` : ""}
Respond with ONLY the YAML content. DO NOT include any markdown code blocks, code fences, or extra commentary.
    `.trim();
  } else if (analysis.requirementsTxt) {
    prompt = `
You are an expert in CI/CD. Generate a GitHub Actions workflow YAML for building and testing a Python project.
Here is the requirements.txt:
${analysis.requirementsTxt}
Default branch: ${analysis.default_branch}
${analysis.readme ? `\nHere is the README:\n${analysis.readme}` : ""}
Respond with ONLY the YAML content. DO NOT include any markdown code blocks, code fences, or extra commentary.
    `.trim();
  } else {
    prompt = `
You are an expert in CI/CD. Generate a GitHub Actions workflow YAML for building and testing a project with these details:
Languages: ${Object.keys(analysis.languages).join(', ')}
Default branch: ${analysis.default_branch}
${analysis.readme ? `\nHere is the README:\n${analysis.readme}` : ""}
Respond with ONLY the YAML content. DO NOT include any markdown code blocks, code fences, or extra commentary.
    `.trim();
  }

  try {
    const res = await llm.invoke(prompt);
    const output = extractTextContent(res);
    return cleanMarkdownResponse(output);
  } catch (error) {
    console.error("Error generating workflow:", error);
    return "# Error: Unable to generate workflow YAML.";
  }
}
