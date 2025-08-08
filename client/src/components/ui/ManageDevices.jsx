// File: /src/components/ui/ManageDevices.jsx
import { motion } from 'framer-motion';
import { 
  ComputerDesktopIcon, 
  DevicePhoneMobileIcon, 
  DeviceTabletIcon 
} from '@heroicons/react/24/outline';

const ManageDevices = () => {
  const devices = [
    {
      id: 1,
      name: 'Windows Desktop',
      type: 'desktop',
      lastActive: '2 hours ago',
      current: true
    },
    {
      id: 2,
      name: 'iPhone 14',
      type: 'mobile',
      lastActive: '1 day ago',
      current: false
    },
    {
      id: 3,
      name: 'MacBook Pro',
      type: 'desktop',
      lastActive: '3 days ago',
      current: false
    }
  ];

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'mobile':
        return <DevicePhoneMobileIcon className="w-5 h-5" />;
      case 'tablet':
        return <DeviceTabletIcon className="w-5 h-5" />;
      default:
        return <ComputerDesktopIcon className="w-5 h-5" />;
    }
  };

  const handleLogoutOtherDevices = () => {
    // Handle logout from other devices logic here
    console.log('Logging out from other devices...');
  };

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
        delay: 0.2,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const deviceVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: custom * 0.1,
        type: "spring",
        stiffness: 120
      }
    }),
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-800 rounded-lg p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Manage Devices</h3>
        <p className="text-gray-400 text-sm">View and manage devices that have access to your account.</p>
      </div>

      <div className="space-y-3 mb-6">
        {devices.map((device, index) => (
          <motion.div
            key={device.id}
            variants={deviceVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={index}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-gray-300">
                  {getDeviceIcon(device.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-200 font-medium">{device.name}</span>
                    {device.current && (
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 text-sm">Last active: {device.lastActive}</span>
                </div>
              </div>
              
              {!device.current && (
                <button
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
                  aria-label={`Remove ${device.name}`}
                >
                  Remove
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={handleLogoutOtherDevices}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        aria-label="Log out from other devices"
      >
        Log out from other devices
      </motion.button>
    </motion.div>
  );
};

export default ManageDevices;