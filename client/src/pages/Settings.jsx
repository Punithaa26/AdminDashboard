// File: /src/pages/Settings.jsx
import { motion } from 'framer-motion';
import ChangePassword from '../components/ui/ChangePassword';
import NotificationSettings from '../components/ui/NotificationSettings';
import ManageDevices from '../components/ui/ManageDevices';
import AccountInfo from '../components/ui/AccountInfo';

const Settings = () => {
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

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
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
      <motion.div variants={headerVariants} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">⚙️</span>
          <motion.h1 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
          >
            Settings
          </motion.h1>
        </div>
        <motion.p 
          className="text-gray-400 text-sm sm:text-base"
        >
          Manage your account settings and preferences
        </motion.p>
      </motion.div>

      {/* Settings Grid */}
      <div className="container mx-auto max-w-7xl">
        {/* First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
          <ChangePassword />
          <NotificationSettings />
        </div>
        
        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          <ManageDevices />
          <AccountInfo />
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;