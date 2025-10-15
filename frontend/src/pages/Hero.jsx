import React from 'react'

const Hero = () => {
  return (
   <div
  className="hero min-h-screen"
  style={{
    backgroundImage:
      "url(https://images.unsplash.com/photo-1441095179793-e2c059a90f56?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
     backgroundSize: "cover",
     opacity:0.9 

  }}
>
  <div className="hero-overlay"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w-md">
      <h1 className="mb-5 text-4xl text-purple-400 font-extrabold">Welcome to Our Store!</h1>
      <p className="mb-5 text-gray-300">
     Discover a wide range of quality products tailored to your needs. From daily essentials to unique finds, we bring you trusted items with great value. Shop confidently, knowing every product is handpicked for satisfaction and style.
      </p>
      <button
  className="btn btn-primary"
  onClick={() => {
    document.getElementById("product-section")?.scrollIntoView({ behavior: "smooth" });
  }}
>
  Explore Products
</button>
    </div>
  </div>
</div>
  )
}

export default Hero