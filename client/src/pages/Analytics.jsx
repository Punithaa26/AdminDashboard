import StatsCards from '../components/ui/StatsCards';
import ContentPerformanceChart from '../components/ui/ContentPerformanceChart';
import UserDistributionChart from '../components/ui/UserDistributionChart';
import SystemPerformanceChart from '../components/ui/SystemPerformanceChart';
import TopBar from '../components/ui/TopBar';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <TopBar/>
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
  );
};

export default Analytics;
