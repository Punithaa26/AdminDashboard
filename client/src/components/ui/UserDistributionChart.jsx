import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const UserDistributionChart = () => {
  const data = [
    { id: 'premium', name: 'Premium Users', value: 35, color: '#00FFFF' },
    { id: 'free', name: 'Free Users', value: 30, color: '#39FF14' },
    { id: 'trial', name: 'Trial Users', value: 25, color: '#FF1493' },
    { id: 'inactive', name: 'Inactive', value: 10, color: '#6B7280' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{payload[0].payload.name}</p>
          <p className="text-[#00FFFF]">
            {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">User Distribution</h3>
        <div className="w-6 h-6 bg-gradient-to-r from-[#00FFFF] to-[#39FF14] rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-black rounded-full"></div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-white/70">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDistributionChart;