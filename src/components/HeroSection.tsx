export default function HeroSection() {
  return (
    <section className="w-full max-w-3xl mx-auto mb-10 mt-8 text-center">
      <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
        <span className="block">AI DevOps Agent</span>
        <span className="block text-lime-500 mt-2">Automate, Review, and Generate</span>
        <span className="block text-gray-700 text-2xl mt-2 font-medium">for your GitHub projects</span>
      </h1>
      <p className="text-lg text-gray-600 mt-4">
        Instantly generate Dockerfiles, CI/CD workflows, documentation, and more.  
        <br />
        Let AI handle DevOps best practices, security, and explanations—so you can focus on building.
      </p>
    </section>
  );
}
