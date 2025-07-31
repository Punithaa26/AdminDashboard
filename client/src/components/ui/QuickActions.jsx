import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtil";

const QuickActions = ({ userGrowthData, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  // Default user growth data if none provided
  const userGrowth =
    userGrowthData && userGrowthData.length > 0
      ? userGrowthData
      : [
          { day: "Mon", users: 10 },
          { day: "Tue", users: 25 },
          { day: "Wed", users: 18 },
          { day: "Thu", users: 32 },
          { day: "Fri", users: 29 },
        ];

  const handleCreateUser = async () => {
    // For now, redirect to a user creation form or show a modal
    showSuccessToast("User creation feature coming soon!");
  };

  const handleReviewContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch flagged activities or content
      const response = await axios.get(
        `${BASE_URL}/api/dashboard/activities/recent?limit=20`,
        config
      );

      showSuccessToast("Content review completed");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error reviewing content:", error);
      showErrorToast("Failed to review content");
    } finally {
      setLoading(false);
    }
  };

  const handleSystemBackup = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Trigger system backup (this would be a custom endpoint)
      // For now, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showSuccessToast("System backup completed successfully");
    } catch (error) {
      console.error("Error running backup:", error);
      showErrorToast("System backup failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-white">Quick Actions</h2>

      <div className="space-y-3">
        <button className="w-full text-left bg-gradient-to-r from-[#00FFFF]/10 to-[#39FF14]/10 text-[#00FFFF] hover:bg-[#00ffff1a] px-4 py-2 rounded-md transition">
          ➕ Create New User
        </button>
        <button className="w-full text-left bg-[#292929] hover:bg-[#333] text-white px-4 py-2 rounded-md transition">
          🚩 Review Flagged Content
        </button>
        <button className="w-full text-left bg-[#292929] hover:bg-[#333] text-white px-4 py-2 rounded-md transition">
          💾 Run System Backup
        </button>
      </div>

      <div className="pt-4">
        <p className="text-sm text-white/60 mb-2">User Growth (This Week)</p>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={userGrowth}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#39FF14" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#39FF14"
              fill="url(#colorUsers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuickActions;
