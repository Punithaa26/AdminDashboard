import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Welcome = () => {
  const navigate = useNavigate();

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
    <div className="text-center text-electric p-10">
      <h1 className="text-4xl font-bold">Welcome, User 🚀</h1>
    </div>
  );
};

export default Welcome;
