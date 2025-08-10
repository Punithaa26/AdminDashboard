// File: /src/components/ui/SystemStatus.jsx
import { motion } from 'framer-motion';

const SystemStatus = () => {
  const services = [
    { name: 'API Services', status: 'online' },
    { name: 'Database', status: 'online' },
    { name: 'Cache', status: 'maintenance' }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'online':
        return {
          color: 'bg-green-500',
          text: 'Online',
          textColor: 'text-green-400',
          animate: false
        };
      case 'maintenance':
        return {
          color: 'bg-yellow-500',
          text: 'Maintenance',
          textColor: 'text-yellow-400',
          animate: true
        };
      case 'error':
        return {
          color: 'bg-red-500',
          text: 'Error',
          textColor: 'text-red-400',
          animate: true
        };
      default:
        return {
          color: 'bg-gray-500',
          text: 'Unknown',
          textColor: 'text-gray-400',
          animate: false
        };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 120
      }
    }
  };

  const blinkVariants = {
    blink: {
      opacity: [1, 0.3, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
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
      <motion.h3 
        variants={itemVariants}
        className="text-lg font-semibold text-gray-200 dark:text-gray-100 mb-4"
      >
        System Status
      </motion.h3>
      
      <motion.div
        variants={itemVariants}
        className="mb-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 bg-green-500 rounded-full"
          />
          <span className="text-sm text-green-400 font-medium">
            All systems operational
          </span>
        </div>
      </motion.div>

      <div className="space-y-3">
        {services.map((service, index) => {
          const config = getStatusConfig(service.status);
          
          return (
            <motion.div
              key={service.name}
              variants={itemVariants}
              className="flex items-center justify-between py-2"
            >
              <span className="text-sm text-gray-300 dark:text-gray-200">
                {service.name}
              </span>
              <div className="flex items-center gap-2">
                <motion.div
                  className={`w-2 h-2 rounded-full ${config.color}`}
                  animate={config.animate ? "blink" : ""}
                  variants={blinkVariants}
                />
                <span className={`text-sm font-medium ${config.textColor}`}>
                  {config.text}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SystemStatus;