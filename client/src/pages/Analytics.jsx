import StatsCards from '../components/ui/StatsCards';
import ContentPerformanceChart from '../components/ui/ContentPerformanceChart';
import UserDistributionChart from '../components/ui/UserDistributionChart';
import SystemPerformanceChart from '../components/ui/SystemPerformanceChart';
import TopBar from '../components/ui/TopBar';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { showErrorToast,showSuccessToast } from '../utils/toastUtil';
import { BASE_URL } from '../utils/constant';

const Analytics = () => {
  const [statsdata,setStatsdata]=useState(null);
  const navigate=useNavigate();
  const [loading,setLoading]=useState(false);
   useEffect(() => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Redirect if not logged in
      if (!token || !user) {
        navigate("/login");
        return;
      }
  
      // Redirect non-admin users
      if (user?.role !== "admin") {
        navigate("/welcome");
        return;
      }
  
      // Fetch dashboard data
      fetchStatsData();
    }, [navigate]);
  
    const fetchStatsData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
  
        // Fetch all dashboard data in parallel
        const statsResponse= await axios.get(`${BASE_URL}/api/dashboard/stats/overview`, config);
  
        setStatsdata( statsResponse.data.data,);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showErrorToast('Failed to load dashboard data');
        
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
  
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212]">
          <div className="text-white text-xl">Loading analytics...</div>
        </div>
      );
    }
  
  return (
    <div className="space-y-6">
      <TopBar/>
      {/* Stats Cards */}
      <StatsCards data={statsdata} />

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
