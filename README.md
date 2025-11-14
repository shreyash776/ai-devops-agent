# CodeFlow AI — Your AI DevOps Agent 🚀

**Deployed:** https://ai-devops-agent-iaol.vercel.app/ 


CodeFlow AI is an AI-powered **DevOps automation assistant** that helps developers generate CI/CD workflows, Dockerfiles, architecture docs, and security reviews for their GitHub projects — instantly.  
It acts as a **personal DevOps engineer**, built using **LangChain**, **Next.js**, and automated pipelines to simplify and supercharge your development workflow.

Let AI handle DevOps, review your code, explain complex logic, generate deployment pipelines, and more — so you can **ship features faster with confidence**.

---

## ⚡ What CodeFlow AI Does

- 🛠 **Generates Dockerfiles** tailored to your project  
- 🔄 **Creates CI/CD pipelines** (GitHub Actions, Docker deploy, etc.)  
- 🧪 **Automates testing workflows**  
- 🔒 **Performs security + config audits** using AI  
- 🧠 **Explains code & suggests improvements**  
- 🏗 **Generates architecture documentation**  
- 📁 **Auto-writes README.md files**  
- 📦 **Automates repetitive DevOps tasks**  

All from your GitHub repo URL — CodeFlow AI analyzes the project and handles the rest.

---

## 🧩 Tech Stack

- **Framework:** Next.js  
- **AI Orchestration:** LangChain  
- **LLM:** OpenAI / (extendable to others)  
- **Automation Layer:** Custom pipelines for GitHub projects  
- **Deployment:** Vercel / Node server (choose yours)  

---

## 🚀 Features

- GitHub repo ingestion & code understanding  
- File-level and project-level analysis  
- Automated DevOps artifact generation:
  - Dockerfiles  
  - Docker Compose files  
  - CI/CD workflows  
  - Deployment scripts  
  - Documentation  
- Code review with suggestions  
- Security & vulnerability checks (AI-based)  
- Code explanation engine for quick onboarding  
- One-click export for generated DevOps assets  

---

## 🧠 How It Works

1. **User enters a GitHub repo URL**  
2. CodeFlow AI fetches and analyzes the repository structure  
3. LangChain pipelines break down code, dependencies, config, and structure  
4. AI generates:
   - Dockerfile  
   - CI/CD workflow  
   - Documentation  
   - Security review  
   - Code explanation  
5. User downloads or copies generated DevOps artifacts  
6. Optional: automated commit back to GitHub

---

## 📦 Installation (Local Development)

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/codeflow-ai.git
cd codeflow-ai

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=...
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_VERCEL_URL=http://localhost:3000
