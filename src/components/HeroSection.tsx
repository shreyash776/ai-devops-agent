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

     
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  }}
  className="text-gray-600 mt-6 space-y-4 text-base sm:text-lg leading-relaxed"
>
  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    Generate <span className="text-gray-800 font-semibold">Dockerfiles</span>, 
    <span className="text-gray-800 font-semibold"> CI/CD workflows</span>, and 
    <span className="text-gray-800 font-semibold"> docs</span> instantly.
  </motion.p>
  
  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.3 }}
  >
    Let AI handle <span className="text-gray-800 font-medium">DevOps</span>, 
    <span className="text-gray-800 font-medium"> security</span>, and 
    <span className="text-gray-800 font-medium"> code explanations</span> — 
    so you can ship faster.
  </motion.p>
</motion.div>


    </section>
  );
}
