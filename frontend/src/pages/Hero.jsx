import React from 'react'

const Hero = () => {
  return (
    <div
      className="hero min-h-[70vh] sm:min-h-[80vh] relative"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1441095179793-e2c059a90f56?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-overlay bg-gradient-to-b from-black/70 via-black/60 to-black/40"></div>
      <div className="hero-content text-neutral-content text-center px-4">
        <div className="max-w-xl mx-auto bg-black/40 backdrop-blur-md rounded-3xl p-5 sm:p-8 shadow-2xl border border-white/10">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-3">
            Next‑gen shopping experience
          </p>
          <h1 className="mb-3 sm:mb-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300">
            Welcome to Our Store
          </h1>
          <p className="mb-5 sm:mb-6 text-sm sm:text-base text-gray-200 leading-relaxed">
            Discover a wide range of carefully curated products – from daily
            essentials to standout tech – all in one clean and modern interface.
          </p>
          <button
            className="btn btn-sm sm:btn-md btn-primary px-6 sm:px-8 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-transform duration-200 hover:scale-105"
            onClick={() => {
              document
                .getElementById("product-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Explore Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero