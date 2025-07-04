'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
export default function Home() {
  const [repo, setRepo] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setServices([]);
    setResult(null);
    try {
      const res = await fetch('/api/analyze-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data);
      setServices(data.services || []);
    } catch (err) {
      setError(err.message || 'Failed to analyze repo.');
    }
    setLoading(false);
  };

  const handleService = async (service) => {
    setLoading(true);
    setResult(null);
    setError(null);
    let endpoint = '';
    let body = {};

    switch (service) {
      case 'review-dockerfile':
        endpoint = '/api/review-dockerfile';
        body = { dockerfileContent: analysis.dockerfileContent };
        break;
      case 'generate-dockerfile':
        endpoint = '/api/generate-dockerfile';
        body = { repo };
        break;
      case 'review-workflow':
        endpoint = '/api/review-workflow';
        const workflowFile = analysis.fileTree.find(f => f.startsWith('.github/workflows/'));
        const workflowRes = await fetch(`/api/fetch-file`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repo, path: workflowFile }),
        });
        const workflowData = await workflowRes.json();
        body = { workflowContent: workflowData.content };
        break;
      case 'generate-workflow':
        endpoint = '/api/generate-workflow';
        body = { repo };
        break;
      case 'security-audit':
        endpoint = '/api/security-audit';
        body = { analysis };
        break;
      case 'generate-docs':
        endpoint = '/api/generate-docs';
        body = { analysis };
        break;
      case 'explain-dockerfile':
        endpoint = '/api/explain-file';
        body = { fileContent: analysis.dockerfileContent, fileType: 'Dockerfile' };
        break;
      case 'explain-workflow':
        endpoint = '/api/explain-file';
        const wfFile = analysis.fileTree.find(f => f.startsWith('.github/workflows/'));
        const wfRes = await fetch(`/api/fetch-file`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repo, path: wfFile }),
        });
        const wfData = await wfRes.json();
        body = { fileContent: wfData.content, fileType: 'GitHub Actions Workflow' };
        break;
      default:
        setError('Unknown service');
        setLoading(false);
        return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('Failed to run service.');
    }
    setLoading(false);
  };

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI DevOps Agent</h1>

      <input
        type="url"
        className="border p-2 w-full mb-2"
        placeholder="Paste GitHub repo URL"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
        required
      />

      <button
        onClick={handleAnalyze}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        disabled={loading || !repo}
      >
        {loading ? 'Analyzing...' : 'Analyze Repo'}
      </button>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      {services.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Available Services</h2>
          <div className="flex flex-wrap gap-2">
            {services.map(service => (
              <button
                key={service}
                onClick={() => handleService(service)}
                className="bg-gray-200 px-3 py-1 rounded text-black"
                disabled={loading}
              >
                {service.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Result</h2>

          {/* <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto text-gray-800 whitespace-pre-wrap">
  {
    typeof result === 'string'
      ? result
      : typeof result.dockerfile === 'string'
      ? result.dockerfile
      : typeof result.workflow === 'string'
      ? result.workflow
      : typeof result.audit === 'string'
      ? result.audit
      : JSON.stringify(result, null, 2)
  }
</pre> */}
<pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto text-gray-800 whitespace-pre-wrap overflow-y-auto h-100">
{/* <ReactMarkdown>
   {
      typeof result === 'string'
        ? result
        : result?.dockerfile ||
          result?.workflow ||
          result?.audit ||
          result?.docs ||
          result?.documentation ||
          result?.explanation ||
          JSON.stringify(result, null, 2)
    }
  </ReactMarkdown> */}

  <ReactMarkdown>
  {
    typeof result === 'string'
      ? result
      : // Find first string field in result
        Object.values(result || {}).find(v => typeof v === 'string') ||
        JSON.stringify(result, null, 2)
  }
</ReactMarkdown>
</pre>


        
        </div>
      )}
    </main>
  );
}
