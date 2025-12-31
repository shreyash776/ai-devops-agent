import { FaRocket, FaRobot, FaLock, FaRegFileAlt } from 'react-icons/fa';

const FEATURES = [
  {
    icon: <FaRocket className="text-lime-500 text-3xl" />,
    title: "Instant DevOps",
    desc: "Get Dockerfiles, workflows, and docs generated in seconds.",
  },
  {
    icon: <FaRobot className="text-purple-500 text-3xl" />,
    title: "AI-Powered Reviews",
    desc: "Let AI review your configs and suggest best practices.",
  },
  {
    icon: <FaLock className="text-red-500 text-3xl" />,
    title: "Security Insights",
    desc: "Automatic security checks for your project’s automation.",
  },
  {
    icon: <FaRegFileAlt className="text-blue-500 text-3xl" />,
    title: "Explain & Learn",
    desc: "AI explains your DevOps files in simple language.",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="w-full max-w-6xl mx-auto mb-16 mt-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4 tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>
        Why Choose CodeFlow AI?
      </h2>
      <p className="text-center text-gray-600 text-base sm:text-lg mb-10 font-medium max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-inter)' }}>
        Streamline your DevOps workflow with intelligent automation and insights
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {FEATURES.map((feature, idx) => (
          <div
            key={feature.title}
            className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm hover:shadow-xl hover:border-lime-300 transition-all duration-300 text-center group hover:-translate-y-1"
          >
            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
            <div className="font-bold text-lg mb-2 text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>{feature.title}</div>
            <div className="text-gray-600 text-sm leading-relaxed font-medium" style={{ fontFamily: 'var(--font-inter)' }}>{feature.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
