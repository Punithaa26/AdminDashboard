import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const systemHealth = [
  { name: 'Healthy', value: 80 },
  { name: 'Warnings', value: 15 },
  { name: 'Errors', value: 5 },
];

const COLORS = ['#00FF7F', '#FFD700', '#FF4C4C'];

const SystemStatusWidget = () => {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-white">System Health</h2>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={systemHealth}
            cx="50%"
            cy="50%"
            outerRadius={70}
            label
            dataKey="value"
          >
            {systemHealth.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="#222" />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SystemStatusWidget;
