'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [repo, setRepo] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [loadingDocker, setLoadingDocker] = useState(false);
  const [loadingWorkflow, setLoadingWorkflow] = useState(false);
  const [dockerfile, setDockerfile] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  const handleGenerateDockerfile = async () => {
    setLoadingDocker(true);
    setError(null);
    setDockerfile(null);
    try {
      const res = await fetch('/api/generate-dockerfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo }),
      });
      const data = await res.json();
      console.log('API response:', data);
      if (data.dockerfile) {
        setDockerfile(data.dockerfile);
      } else {
        setError(data.error || 'Failed to generate Dockerfile.');
      }
    } catch (err) {
      setError('Failed to generate Dockerfile.');
    }
    setLoadingDocker(false);
  };

  const handleGenerateWorkflow = async () => {
    setLoadingWorkflow(true);
    setError(null);
    setWorkflow(null);
    try {
      const res = await fetch('/api/generate-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo }),
      });
      const data = await res.json();
      console.log('API response:', data);
      if (data.workflow) {
        setWorkflow(data.workflow);
      } else {
        setError(data.error || 'Failed to generate Workflow file.');
      }
    } catch (err) {
      setError('Failed to generate Workflow file.');
    }
    setLoadingWorkflow(false);
  };

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI DevOps Agent</h1>
      <div className="mb-4">
        <input
          type="url"
          className="border p-2 w-full mb-2"
          placeholder="Paste GitHub repo URL"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          required
        />
        <div className="flex gap-2">
          <button
            onClick={handleGenerateDockerfile}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loadingDocker || !repo}
          >
            {loadingDocker ? 'Generating Dockerfile...' : 'Generate Dockerfile'}
          </button>
          <button
            onClick={handleGenerateWorkflow}
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={loadingWorkflow || !repo}
          >
            {loadingWorkflow ? 'Generating Workflow...' : 'Generate Workflow'}
          </button>
        </div>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      {/* Only render results on the client */}
      {isClient && dockerfile && (
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Dockerfile</h2>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto text-red-700">
            {dockerfile}
          </pre>
          {/* <pre>
  {typeof dockerfile === 'string' ? dockerfile : JSON.stringify(dockerfile, null, 2)}
</pre> */}
        </div>
      )}
      {isClient && workflow && (
        <div className="mb-4">
          <h2 className="font-semibold mb-2">GitHub Actions Workflow</h2>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto text-red-700">
            {workflow}
          </pre>
          {/* <pre>
  {typeof workflow === 'string' ? workflow : JSON.stringify(workflow, null, 2)}
</pre> */}
        </div>
      )}
    </main>
  );
}
