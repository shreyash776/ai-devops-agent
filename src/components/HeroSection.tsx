'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="w-full max-w-3xl mx-auto mb-12 mt-14 text-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
      >
        <span className="block drop-shadow-sm">AI DevOps Agent</span>
        <motion.span
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          className="block text-lime-500 mt-3"
        >
          Automate, Review, and Generate
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="block text-gray-700 text-2xl mt-3 font-medium"
        >
          for your GitHub projects
        </motion.span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="text-lg text-gray-600 mt-5 leading-relaxed"
      >
        Instantly generate Dockerfiles, CI/CD workflows, documentation, and more.
        <br />
        Let AI handle DevOps best practices, security, and explanations—so you can focus on building.
      </motion.p>
    </section>
  );
}
