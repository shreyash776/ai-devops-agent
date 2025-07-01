import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


function cleanMarkdownResponse(content: string): string {
  if (!content) return "";
  return content
    .replace(/^```[a-zA-Z0-9]*\n?/, "")
    .replace(/```/g, "")
    .trim();
}

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


export async function reviewDockerfile(dockerfileContent: string): Promise<string> {
  const prompt = `
You are a DevOps expert. Review the following Dockerfile for security, efficiency, and best practices.
Suggest improvements and explain your reasoning.
Dockerfile:
${dockerfileContent}
  `.trim();
  try {
    const res = await llm.invoke(prompt);
    return cleanMarkdownResponse(extractTextContent(res));
  } catch (error) {
    console.error("Error reviewing Dockerfile:", error);
    return "# Error: Unable to review Dockerfile.";
  }
}


export async function reviewWorkflow(workflowContent: string): Promise<string> {
  const prompt = `
You are a CI/CD expert. Review the following GitHub Actions workflow YAML for best practices, security, and efficiency.
Suggest improvements and explain your reasoning.
Workflow YAML:
${workflowContent}
  `.trim();
  try {
    const res = await llm.invoke(prompt);
    return cleanMarkdownResponse(extractTextContent(res));
  } catch (error) {
    console.error("Error reviewing workflow:", error);
    return "# Error: Unable to review workflow.";
  }
}


export async function securityAudit(analysis: any): Promise<string> {
  const prompt = `
You are a security auditor. Analyze this project's configuration and files for security risks or vulnerabilities.
Project details:
${JSON.stringify(analysis, null, 2)}
List all findings and suggest fixes.
  `.trim();
  try {
    const res = await llm.invoke(prompt);
    return cleanMarkdownResponse(extractTextContent(res));
  } catch (error) {
    console.error("Error during security audit:", error);
    return "# Error: Unable to perform security audit.";
  }
}


export async function generateDocs(analysis: any): Promise<string> {
  const prompt = `
You are a DevOps documentation expert. Generate clear documentation for the project's Dockerfile and CI/CD workflow.
Project details:
${JSON.stringify(analysis, null, 2)}
Documentation should explain how to use the Dockerfile and workflow, and how to contribute.
  `.trim();
  try {
    const res = await llm.invoke(prompt);
    return cleanMarkdownResponse(extractTextContent(res));
  } catch (error) {
    console.error("Error generating documentation:", error);
    return "# Error: Unable to generate documentation.";
  }
}


export async function explainFile(fileContent: string, fileType: string): Promise<string> {
  const prompt = `
Explain the following ${fileType} file in simple terms for a developer new to DevOps.
${fileType} content:
${fileContent}
  `.trim();
  try {
    const res = await llm.invoke(prompt);
    return cleanMarkdownResponse(extractTextContent(res));
  } catch (error) {
    console.error("Error explaining file:", error);
    return "# Error: Unable to explain file.";
  }
}
