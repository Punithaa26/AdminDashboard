import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const ContentPerformanceChart = () => {
  const data = [
    { id: 'blog-posts', name: 'Blog Posts', value: 12500 },
    { id: 'videos', name: 'Videos', value: 8900 },
    { id: 'images', name: 'Images', value: 15600 },
    { id: 'podcasts', name: 'Podcasts', value: 4200 },
    { id: 'tutorials', name: 'Tutorials', value: 9800 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-[#00FFFF]">
            Views: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Content Performance</h3>
        <div className="w-6 h-6 bg-gradient-to-r from-[#00FFFF] to-[#39FF14] rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-black rounded-full"></div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              type="number" 
              stroke="rgba(255,255,255,0.6)" 
              fontSize={12}
              tickFormatter={(value) => `${value/1000}k`}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke="rgba(255,255,255,0.6)" 
              width={80}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="url(#contentGradient)" 
              radius={[0, 4, 4, 0]}
            />
            <defs>
              <linearGradient id="contentGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00FFFF" />
                <stop offset="100%" stopColor="#39FF14" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContentPerformanceChart;