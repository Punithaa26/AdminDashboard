import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
   console.log(token);
   console.log(user);
    // Redirect if not logged in
    if (!token || !user) {
      navigate("/login");
    }

    // Redirect non-admin users
    if (user?.role !== "admin") {
      navigate("/welcome");
    }
  }, []);

  return (
    <div className="text-center text-lime p-10">
      <h1 className="text-4xl font-bold">Welcome, Admin 👑</h1>
    </div>
  );
};

export default Dashboard;
