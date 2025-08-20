// File: /src/components/ui/ManageDevices.jsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  ComputerDesktopIcon, 
  DevicePhoneMobileIcon, 
  DeviceTabletIcon 
} from '@heroicons/react/24/outline';

const ManageDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch devices on component mount
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/settings/devices', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Add some mock additional devices for demonstration
        const mockDevices = [
          {
            id: 'device-2',
            name: 'iPhone 14',
            type: 'mobile',
            lastActive: '1 day ago',
            current: false
          },
          {
            id: 'device-3',
            name: 'MacBook Pro',
            type: 'desktop',
            lastActive: '3 days ago',
            current: false
          }
        ];

        setDevices([...data.data, ...mockDevices]);
      } else {
        setError(data.message || 'Failed to fetch devices');
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      if (initialLoad) {
        if (error.message.includes('404')) {
          setError('Device management endpoint not found. Please check server configuration.');
        } else if (error.message.includes('500')) {
          setError('Server error. Please try again later.');
        } else {
          setError('Failed to fetch devices');
        }
      }
    } finally {
      setInitialLoad(false);
    }
  };

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

  const handleRemoveDevice = async (deviceId, deviceName) => {
    if (deviceId === 'current-session') {
      setError('Cannot remove current session');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`/api/settings/devices/${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setDevices(prev => prev.filter(device => device.id !== deviceId));
        setSuccess(`${deviceName} removed successfully`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to remove device');
      }
    } catch (error) {
      console.error('Error removing device:', error);
      if (error.message.includes('404')) {
        setError('Remove device endpoint not found. Please check server configuration.');
      } else if (error.message.includes('500')) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to remove device');
      }
    }
  };

  const handleLogoutOtherDevices = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/settings/devices/logout-others', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Remove all non-current devices from the list
        setDevices(prev => prev.filter(device => device.current));
        setSuccess('Successfully logged out from other devices');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to logout from other devices');
      }
    } catch (error) {
      console.error('Error logging out from other devices:', error);
      if (error.message.includes('404')) {
        setError('Logout endpoint not found. Please check server configuration.');
      } else if (error.message.includes('500')) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to logout from other devices');
      }
    } finally {
      setLoading(false);
    }
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

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

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
                  onClick={() => handleRemoveDevice(device.id, device.name)}
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
        disabled={loading}
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Log out from other devices"
      >
        {loading ? 'Logging out...' : 'Log out from other devices'}
      </motion.button>
    </motion.div>
  );
};

export default ManageDevices;