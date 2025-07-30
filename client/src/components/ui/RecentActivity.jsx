import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const activityData = [
  { time: "10AM", logins: 5 },
  { time: "11AM", logins: 8 },
  { time: "12PM", logins: 6 },
  { time: "1PM", logins: 12 },
  { time: "2PM", logins: 9 },
];
const activities = [
  {
    emoji: "🟢",
    text: "Alice joined the platform",
    time: "2 mins ago",
    color: "text-[#39FF14]",
  },
  {
    emoji: "📤",
    text: "John uploaded a post",
    time: "10 mins ago",
    color: "text-cyan-400",
  },
  {
    emoji: "🔐",
    text: "Bob changed password",
    time: "1 hr ago",
    color: "text-yellow-300",
  },
];

const RecentActivity = () => {
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
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="logins"
              stroke="#00FFFF"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RecentActivity;
