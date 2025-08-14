import React from 'react'

const Hero = () => {
  return (
   <div
  className="hero min-h-screen"
  style={{
    backgroundImage:
      "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
  }}
>
  <div className="hero-overlay"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w-md">
      <h1 className="mb-5 text-4xl text-purple-400 font-extrabold">Welcome to Our Store!</h1>
      <p className="mb-5 ">
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