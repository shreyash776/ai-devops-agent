'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="w-full max-w-4xl mx-auto mb-16 mt-14 text-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-5xl sm:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight"
        style={{ fontFamily: 'var(--font-jakarta)' }}
      >
        <span className="block drop-shadow-sm">AI DevOps Agent</span>
        <motion.span
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          className="block text-lime-500 mt-4 font-bold tracking-tight"
        >
          Automate, Review, and Generate
        </motion.span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-gray-500 text-lg sm:text-xl mb-10 font-medium"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        for your GitHub projects
      </motion.p>

      {/* Feature Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="flex flex-wrap justify-center gap-3 mt-8 max-w-2xl mx-auto"
      >
        {['Dockerfiles', 'CI/CD Workflows', 'Documentation', 'Security Audits', 'Code Explanations'].map((feature, idx) => (
          <motion.span
            key={feature}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + idx * 0.1, duration: 0.4 }}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md hover:border-lime-300 transition-all"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {feature}
          </motion.span>
        ))}
      </motion.div>
    </section>
  );
}
