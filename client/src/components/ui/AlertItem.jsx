// File: /src/components/ui/AlertItem.jsx
import { motion } from 'framer-motion';

const AlertItem = ({ type, message, timestamp, delay = 0 }) => {
  const getIconAndColor = () => {
    switch (type) {
      case 'error':
        return {
          icon: '🔴',
          bgColor: 'hover:bg-red-500/10 dark:hover:bg-red-500/20',
          borderColor: 'border-l-red-500',
          textColor: 'text-red-400'
        };
      case 'warning':
        return {
          icon: '🟡',
          bgColor: 'hover:bg-yellow-500/10 dark:hover:bg-yellow-500/20',
          borderColor: 'border-l-yellow-500',
          textColor: 'text-yellow-400'
        };
      case 'info':
        return {
          icon: '🔵',
          bgColor: 'hover:bg-blue-500/10 dark:hover:bg-blue-500/20',
          borderColor: 'border-l-blue-500',
          textColor: 'text-blue-400'
        };
      default:
        return {
          icon: '⚪',
          bgColor: 'hover:bg-gray-500/10 dark:hover:bg-gray-500/20',
          borderColor: 'border-l-gray-500',
          textColor: 'text-gray-400'
        };
    }
  };

  const { icon, bgColor, borderColor, textColor } = getIconAndColor();

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay,
        type: "spring",
        stiffness: 120
      }
    },
    hover: {
      scale: 1.02,
      x: 5,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`
        p-3 sm:p-4 rounded-lg border-l-4 ${borderColor}
        bg-gray-800/30 dark:bg-gray-800/50 ${bgColor}
        transition-all duration-300 cursor-pointer
        hover:shadow-lg hover:shadow-${type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500/20
      `}
    >
      <div className="flex items-start gap-3">
        <span className="text-sm mt-0.5 flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base text-gray-200 dark:text-gray-100 mb-1 break-words">
            {message}
          </p>
          <p className={`text-xs ${textColor} font-medium`}>
            {timestamp}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertItem;