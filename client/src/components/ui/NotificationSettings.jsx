// File: /src/components/ui/NotificationSettings.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    appNotifications: true,
    emailAlerts: false,
    systemWarnings: true,
    weeklySummary: true
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    // Handle save preferences logic here
    console.log('Saving notification preferences:', notifications);
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
        delay: 0.1,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const toggleVariants = {
    hover: {
      scale: 1.05,
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

  const ToggleSwitch = ({ isOn, onToggle, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="text-gray-200 font-medium">{label}</div>
        {description && (
          <div className="text-gray-400 text-sm mt-1">{description}</div>
        )}
      </div>
      <motion.button
        variants={toggleVariants}
        whileHover="hover"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
          isOn ? 'bg-green-500' : 'bg-gray-600'
        }`}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </motion.button>
    </div>
  );

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-800 rounded-lg p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Notification Settings</h3>
        <p className="text-gray-400 text-sm">Choose what kind of notifications you want to receive.</p>
      </div>

      <div className="space-y-2 mb-6">
        <ToggleSwitch
          isOn={notifications.appNotifications}
          onToggle={() => handleToggle('appNotifications')}
          label="App Notifications"
          description="Get notified about app activities"
        />
        
        <ToggleSwitch
          isOn={notifications.emailAlerts}
          onToggle={() => handleToggle('emailAlerts')}
          label="Email Alerts"
          description="Receive important updates via email"
        />
        
        <ToggleSwitch
          isOn={notifications.systemWarnings}
          onToggle={() => handleToggle('systemWarnings')}
          label="System Warnings"
          description="Get alerts about system issues"
        />
        
        <ToggleSwitch
          isOn={notifications.weeklySummary}
          onToggle={() => handleToggle('weeklySummary')}
          label="Weekly Summary"
          description="Receive weekly activity reports"
        />
      </div>

      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        aria-label="Save notification preferences"
      >
        Save Preferences
      </motion.button>
    </motion.div>
  );
};

export default NotificationSettings;