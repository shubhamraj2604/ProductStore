import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-base-300">
        <div className="mb-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold  text-black text-base-content mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-base-content/70 text-gray-800">
            Sign in to manage products, view your cart and continue shopping.
          </p>
        </div>

        <div className="mt-4 md:mr-10 bg-white">
          <SignIn
            routing="path"
            path="/login"
            appearance={{
              elements: {
                card: "shadow-none bg-white",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "btn btn-outline btn-sm sm:btn-md w-full mb-2",
                formButtonPrimary: "btn btn-primary w-full mt-2",
                formFieldInput:
                  "input input-bordered w-full text-sm sm:text-base bg-white",
                footerActionText: "text-sm",
              },
            }}
          />
        </div>

        <div className="mt-4 text-center text-xs sm:text-sm text-base-content/60">
          <span>Want to go back? </span>
          <Link to="/" className="link link-primary font-medium">
            Return to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

