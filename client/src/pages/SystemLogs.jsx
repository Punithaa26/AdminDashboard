// File: /src/pages/SystemLogs.jsx
import { motion } from 'framer-motion';
import StatsCard from '../components/ui/StatsCard';
import AlertItem from '../components/ui/AlertItem';
import SystemStatus from '../components/ui/SystemStatus';
import ActivityTrend from '../components/ui/ActivityTrend';
import LogFilters from '../components/ui/LogFilters';

const SystemLogs = () => {
  // Dummy data for stats cards
  const statsData = [
    {
      title: 'Total Logs',
      value: '12,457',
      subtitle: 'All recorded events',
      icon: '📊',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/30',
      textColor: 'text-blue-400'
    },
    {
      title: 'Errors Today',
      value: '27',
      subtitle: 'Critical failures',
      icon: '⚠️',
      bgColor: 'bg-gradient-to-br from-red-500/20 to-red-600/30',
      textColor: 'text-red-400'
    },
    {
      title: 'Warnings',
      value: '103',
      subtitle: 'Moderate issues',
      icon: '⚠️',
      bgColor: 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/30',
      textColor: 'text-yellow-400'
    },
    {
      title: 'Uptime',
      value: '99.97%',
      subtitle: 'System availability',
      icon: '✅',
      bgColor: 'bg-gradient-to-br from-green-500/20 to-green-600/30',
      textColor: 'text-green-400'
    }
  ];

  // Dummy data for recent alerts
  const alertsData = [
    {
      type: 'error',
      message: 'Database connection failed',
      timestamp: 'at 02:13 AM'
    },
    {
      type: 'warning',
      message: 'Slow response from /api/users',
      timestamp: 'at 04:15 AM'
    },
    {
      type: 'error',
      message: 'Memory threshold exceeded',
      timestamp: 'at 05:22 AM'
    }
  ];

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const statsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const alertsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-4 sm:p-6 lg:p-8"
    >
      {/* Page Header */}
      <motion.div variants={sectionVariants} className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2"
        >
          System Logs
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-400 dark:text-gray-300 text-sm sm:text-base"
        >
          Monitor your application's critical logs and track system behavior.
        </motion.p>
      </motion.div>

      {/* Stats Cards Grid */}
      <motion.div
        variants={statsContainerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
      >
        {statsData.map((stat, index) => (
          <StatsCard
            key={stat.title}
            {...stat}
            delay={index * 0.1}
          />
        ))}
      </motion.div>

      {/* Recent Alerts Section */}
      <motion.div variants={sectionVariants} className="mb-8">
        <motion.h2 
          className="text-xl sm:text-2xl font-semibold text-white mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Recent Alerts
        </motion.h2>
        <motion.div
          variants={alertsContainerVariants}
          className="space-y-3"
        >
          {alertsData.map((alert, index) => (
            <AlertItem
              key={index}
              {...alert}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* System Status and Activity Trend */}
      <motion.div 
        variants={sectionVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        <SystemStatus />
        <ActivityTrend />
      </motion.div>

      {/* Log Filters Section */}
      <motion.div variants={sectionVariants}>
        <LogFilters />
      </motion.div>
    </motion.div>
  );
};

export default SystemLogs;