// File: /src/components/ui/ActivityTrend.jsx
import { motion } from 'framer-motion';

const ActivityTrend = () => {
  // Dummy data for the chart bars
  const activityData = [
    { label: '12 AM', value: 30 },
    { label: '2 AM', value: 20 },
    { label: '4 AM', value: 15 },
    { label: '6 AM', value: 45 },
    { label: '8 AM', value: 80 },
    { label: '10 AM', value: 95 },
    { label: '12 PM', value: 85 },
    { label: '2 PM', value: 75 },
    { label: '4 PM', value: 90 },
    { label: '6 PM', value: 70 },
    { label: '8 PM', value: 60 },
    { label: '10 PM', value: 40 }
  ];

  const maxValue = Math.max(...activityData.map(item => item.value));

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05
      }
    }
  };

  const barVariants = {
    hidden: { 
      height: 0,
      opacity: 0 
    },
    visible: (custom) => ({
      height: `${(custom / maxValue) * 100}%`,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }),
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-800/50 dark:bg-gray-800/70 rounded-lg p-4 sm:p-6 border border-gray-700/30 dark:border-gray-600/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200 dark:text-gray-100">
          Activity Trend
        </h3>
        <span className="text-xs text-gray-400 dark:text-gray-300">
          Requests per minute
        </span>
      </div>
      
      <div className="h-32 sm:h-40 flex items-end justify-between gap-1 sm:gap-2 mb-4">
        {activityData.map((item, index) => (
          <motion.div
            key={item.label}
            className="flex-1 flex flex-col items-center"
          >
            <div className="w-full h-24 sm:h-32 relative flex items-end">
              <motion.div
                variants={barVariants}
                custom={item.value}
                whileHover="hover"
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm cursor-pointer relative group"
                style={{ minHeight: '4px' }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: -20 }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none"
                >
                  {item.value}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-300 overflow-x-auto">
        {activityData.map((item, index) => (
          index % 2 === 0 && (
            <span key={item.label} className="flex-shrink-0">
              {item.label}
            </span>
          )
        ))}
      </div>
    </motion.div>
  );
};

export default ActivityTrend;