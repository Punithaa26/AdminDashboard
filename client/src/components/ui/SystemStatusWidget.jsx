import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { BASE_URL } from '../../utils/constant';

const COLORS = ['#00FF7F', '#FFD700', '#FF4C4C'];

const SystemStatusWidget = ({data}) => {
  const [systemHealth, setSystemHealth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (data) {
      processSystemHealthData(data);
    } else {
      fetchSystemHealth();
    }
  }, [data]);

  const fetchSystemHealth = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(
        `${BASE_URL}/api/dashboard/system/health`,
        config
      );

      processSystemHealthData(response.data.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching system health:', error);
      // Fallback data
      setSystemHealth([
        { name: 'Healthy', value: 80 },
        { name: 'Warnings', value: 15 },
        { name: 'Errors', value: 5 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const processSystemHealthData = (healthData) => {
    if (healthData && healthData.health) {
      setSystemHealth(healthData.health);
    } else {
      // Process from services data if available
      if (healthData && healthData.services) {
        const services = healthData.services;
        const serviceStatuses = Object.values(services);
        
        const healthyCount = serviceStatuses.filter(service => service.status === 'healthy').length;
        const warningCount = serviceStatuses.filter(service => service.status === 'warning').length;
        const errorCount = serviceStatuses.filter(service => service.status === 'error').length;
        
        const total = healthyCount + warningCount + errorCount;
        
        setSystemHealth([
          { 
            name: 'Healthy', 
            value: total > 0 ? Math.round((healthyCount / total) * 100) : 80 
          },
          { 
            name: 'Warnings', 
            value: total > 0 ? Math.round((warningCount / total) * 100) : 15 
          },
          { 
            name: 'Errors', 
            value: total > 0 ? Math.round((errorCount / total) * 100) : 5 
          },
        ]);
      }
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const refreshHealth = () => {
    setLoading(true);
    fetchSystemHealth();
  };
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
