import axios from "axios";
// import { toast } from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function useLogin() {
  const loginusers = async (username, email) => {
    if (!username || !email) {
      toast.error("Username or email missing");
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/api/users/login`, {
        username,
        email,
      });
    //   toast.success("User created successfully");
      console.log("Backend response:", response.data);
    } catch (error) {
    //   toast.error("User not created");
      console.log("API error:", error.response ? error.response.data : error.message);
    }
  };

  return { loginusers };
}
