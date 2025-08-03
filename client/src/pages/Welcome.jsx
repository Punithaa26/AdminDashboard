import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../utils/toastUtil";
const Welcome = () => {
  const navigate = useNavigate();

   const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      showSuccessToast("Logout successfully!");
      navigate("/login");
    } catch (error) {
      console.log("failed to logout" + error);
      showErrorToast("Failed to Logout! Try agian!");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    // Redirect if not logged in
    if (!token || !user) {
      navigate("/login");
    }

    // Redirect non-admin users
    if (user?.role == "admin") {
      navigate("/admin");
    }
  }, []);
  return (
    <div className="text-center text-electric p-10 bg-black min-h-screen">
      <h1 className="text-4xl font-bold text-white">Welcome, User 🚀</h1>
      <div className="px-4 mt-4 flex items-center justify-center mt-4">
        <button
          onClick={handleLogout}
          className="w-1/4 flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 text-red-500 hover:bg-red-500/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h4a2 2 0 002-2v-1m-8 0v-1a2 2 0 00-2-2H3a2 2 0 00-2 2v1"
            />
          </svg>
          <span className="font-medium text-center">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Welcome;
