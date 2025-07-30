import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecentActivity from "../components/ui/RecentActivity";
import QuickActions from "../components/ui/QuickActions";
import SystemStatusWidget from "../components/ui/SystemStatusWidget";
import StatsCards from "../components/ui/StatsCards";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Welcome back, Admin 👋</h1>
      <StatsCards />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SystemStatusWidget />
        {/* Optionally place more widgets here */}
      </div>
    </div>
  );
};

export default Dashboard;
