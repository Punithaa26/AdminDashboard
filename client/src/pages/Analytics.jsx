import Sidebar from '../components/ui/Sidebar';
import TopBar from '../components/ui/TopBar';
import StatsCards from '../components/ui/StatsCards';
import ContentPerformanceChart from '../components/ui/ContentPerformanceChart';
import UserDistributionChart from '../components/ui/UserDistributionChart';
import SystemPerformanceChart from '../components/ui/SystemPerformanceChart';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-64 p-6">
        <div className="space-y-6">
          {/* Top Bar */}
          <TopBar />
          
          {/* Stats Cards */}
          <StatsCards />
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContentPerformanceChart />
            <UserDistributionChart />
          </div>
          
          {/* Full Width Chart */}
          <SystemPerformanceChart />
        </div>
      </div>
    </div>
  );
};

export default Analytics;