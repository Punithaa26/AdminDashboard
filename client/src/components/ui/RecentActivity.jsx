import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";

const RecentActivity = ({ data }) => {
  const [loginTrends, setLoginTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoginTrends();
  }, []);

  const fetchLoginTrends = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${BASE_URL}/api/dashboard/analytics/login-trends?timeRange=24h`,
        config
      );

      setLoginTrends(response.data.data);
    } catch (error) {
      console.error("Error fetching login trends:", error);
      // Fallback data
      setLoginTrends([
        { time: "10AM", logins: 5 },
        { time: "11AM", logins: 8 },
        { time: "12PM", logins: 6 },
        { time: "1PM", logins: 12 },
        { time: "2PM", logins: 9 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Default activities if no data provided
  const activities =
    data && data.length > 0
      ? data
      : [
          {
            emoji: "📊",
            text: "No recent activities",
            time: "Just now",
            color: "text-gray-400",
          },
        ];
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-white">Recent Activity</h2>

      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className={`w-full text-left bg-[#292929] hover:bg-[#333] text-white px-4 py-2 rounded-md transition flex justify-between items-center ${activity.color}`}
          >
            <span>
              {activity.emoji} {activity.text}
            </span>
            <span className="text-xs text-white/50">{activity.time}</span>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <p className="text-sm text-white/60 mb-2">Login Trend</p>
        {loading ? (
          <div className="h-[180px] flex items-center justify-center">
            <div className="text-white/60">Loading chart...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={loginTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="logins"
                stroke="#00FFFF"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
