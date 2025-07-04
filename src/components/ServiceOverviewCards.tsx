'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaDocker, FaGithub, FaFileAlt, FaMagic, FaShieldAlt, FaRegFileCode } from 'react-icons/fa';
import { MdOutlineDescription, MdOutlineFileDownload } from 'react-icons/md';
import { ImSpinner2 } from 'react-icons/im';

import HeroSection from '@/components/HeroSection';
import ServiceOverviewCards from '@/components/ServiceOverviewCards';

// ...SERVICE_META and all your hooks and logic as before...

export default function Home() {
  // ...all your state and handlers as before...

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <FaMagic className="text-3xl text-lime-500" />
          <span className="font-extrabold text-2xl text-gray-900 tracking-tight">DevOps Agent</span>
        </div>
        <button className="bg-black text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-gray-900 transition">Get Started — Free</button>
      </header>

      {/* Hero and Service Overview */}
      <HeroSection />
      <ServiceOverviewCards />

      {/* Main functional UI below */}
      <main className="flex flex-col items-center flex-1 w-full px-4 py-10">
        {/* Input bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xl mb-8">
          <input
            type="url"
            className="border border-gray-300 bg-white text-gray-800 placeholder-gray-400 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
            placeholder="Paste GitHub repo URL"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            required
          />
          <button
            onClick={handleAnalyze}
            className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold px-6 py-3 rounded-lg shadow transition flex items-center gap-2"
            disabled={loading || !repo}
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin" /> Analyzing...
              </>
            ) : 'Analyze'}
          </button>
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 border border-red-200 w-full max-w-xl text-center">
            {error}
          </div>
        )}

        {/* Services */}
        {services.length > 0 && (
          <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {services.map(service => (
              <div
                key={service}
                className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-start shadow hover:shadow-lg transition"
              >
                <div className="mb-3">{SERVICE_META[service]?.icon || <FaMagic className="text-xl" />}</div>
                <div className="font-bold text-lg mb-1 text-gray-900">{SERVICE_META[service]?.title || service}</div>
                <div className="text-gray-500 mb-3 text-sm">{SERVICE_META[service]?.desc || ''}</div>
                <button
                  className="mt-auto bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold px-4 py-2 rounded-lg shadow flex items-center gap-2 transition"
                  disabled={!!serviceLoading}
                  onClick={() => handleService(service)}
                >
                  {serviceLoading === service ? (
                    <>
                      <ImSpinner2 className="animate-spin" /> Running...
                    </>
                  ) : 'Run'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 shadow mb-8">
            <h2 className="font-semibold text-2xl mb-3 text-lime-500">Result</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100 text-gray-800 font-mono text-sm whitespace-pre-wrap break-words">
              <ReactMarkdown>
                {
                  typeof result === 'string'
                    ? result
                    : Object.values(result || {}).find(v => typeof v === 'string') ||
                      JSON.stringify(result, null, 2)
                }
              </ReactMarkdown>
            </div>
            {lastGenFile && (
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={handleCreatePR}
                  className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold px-4 py-2 rounded-lg shadow"
                  disabled={prLoading}
                >
                  {prLoading ? (
                    <span className="flex items-center gap-2">
                      <ImSpinner2 className="animate-spin" /> Creating PR...
                    </span>
                  ) : (
                    `Generate Pull Request for ${lastGenFile.path}`
                  )}
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
                >
                  <MdOutlineFileDownload className="text-xl" />
                  Download {lastGenFile.path}
                </button>
                {prUrl && (
                  <div className="ml-2">
                    <a href={prUrl} target="_blank" rel="noopener noreferrer" className="text-lime-600 underline font-semibold">
                      View Pull Request
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
