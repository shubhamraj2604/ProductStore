import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? "http://localhost:3000" : "");

export function useLogin() {
  const loginusers = async (clerkUserId, username, email) => {
    if (!clerkUserId) {
      return; // Clerk not ready yet
    }
    try {
      await axios.post(`${BASE_URL}/api/users/login`, {
        clerkUserId,
        username,
        email,
      });
      console.log("User synced to backend.");
    } catch (error) {
      console.log("Backend sync error:", error.response ? error.response.data : error.message);
    }
  };

  return { loginusers };
}
