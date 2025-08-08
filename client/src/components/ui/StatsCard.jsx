// File: /src/components/ui/StatsCard.jsx
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, subtitle, icon, bgColor, textColor, delay = 0 }) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`
        ${bgColor} rounded-lg p-4 sm:p-6 
        border border-gray-700/30 dark:border-gray-600/30
        backdrop-blur-sm shadow-lg hover:shadow-xl
        transition-all duration-300
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`text-2xl sm:text-3xl font-bold ${textColor} mb-1`}>
            {value}
          </div>
          <div className="text-sm text-gray-400 dark:text-gray-300 mb-1">
            {title}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {subtitle}
          </div>
        </div>
        <div className={`text-2xl ${textColor} opacity-80`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;