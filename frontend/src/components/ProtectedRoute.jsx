import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-6 bg-base-100">
          <p className="text-lg font-semibold mb-4">
            You must be logged in to access this section.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </SignedOut>
    </>
  );
}
