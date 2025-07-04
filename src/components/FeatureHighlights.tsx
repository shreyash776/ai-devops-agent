import { FaRocket, FaRobot, FaLock, FaRegFileAlt } from 'react-icons/fa';

const FEATURES = [
  {
    icon: <FaRocket className="text-lime-500 text-2xl" />,
    title: "Instant DevOps",
    desc: "Get Dockerfiles, workflows, and docs generated in seconds.",
  },
  {
    icon: <FaRobot className="text-purple-500 text-2xl" />,
    title: "AI-Powered Reviews",
    desc: "Let AI review your configs and suggest best practices.",
  },
  {
    icon: <FaLock className="text-red-500 text-2xl" />,
    title: "Security Insights",
    desc: "Automatic security checks for your project’s automation.",
  },
  {
    icon: <FaRegFileAlt className="text-blue-500 text-2xl" />,
    title: "Explain & Learn",
    desc: "AI explains your DevOps files in simple language.",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="w-full max-w-4xl mx-auto mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-center shadow hover:shadow-lg transition text-center"
          >
            <div className="mb-2">{feature.icon}</div>
            <div className="font-bold text-base mb-1 text-gray-900">{feature.title}</div>
            <div className="text-gray-500 text-xs">{feature.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
