// File: /src/components/ui/AccountInfo.jsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const AccountInfo = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: ''
  });
  const [originalInfo, setOriginalInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch account info on component mount
  useEffect(() => {
    fetchAccountInfo();
  }, []);

  const fetchAccountInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/settings/account', {
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
        setUserInfo({
          username: data.data.username,
          email: data.data.email
        });
        setOriginalInfo({
          username: data.data.username,
          email: data.data.email
        });
      } else {
        setError(data.message || 'Failed to fetch account info');
      }
    } catch (error) {
      console.error('Error fetching account info:', error);
      setError('Failed to fetch account information');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleEditInfo = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // Save changes
    if (!userInfo.username || !userInfo.email) {
      setError('Username and email are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/settings/account', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: userInfo.username,
          email: userInfo.email
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Account information updated successfully');
        setOriginalInfo(userInfo);
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update account info');
      }
    } catch (error) {
      console.error('Error updating account info:', error);
      setError('Failed to update account information');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUserInfo(originalInfo);
    setIsEditing(false);
    setError('');
    setSuccess('');
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
        delay: 0.3,
        type: "spring",
        stiffness: 100
      }
    },
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
      whileHover="hover"
      className="bg-gray-800 rounded-lg p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Account Info</h3>
        <p className="text-gray-400 text-sm">View and update your account details like username and email.</p>
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

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={userInfo.username}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white transition-all duration-300 ${
              !isEditing 
                ? 'opacity-50 cursor-not-allowed' 
                : 'focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
            }`}
          />
        </div>

        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white transition-all duration-300 ${
              !isEditing 
                ? 'opacity-50 cursor-not-allowed' 
                : 'focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
            }`}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleEditInfo}
          disabled={loading}
          className={`flex-1 font-medium py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
            isEditing
              ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
              : 'bg-yellow-500 hover:bg-yellow-600 text-black focus:ring-yellow-500'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={isEditing ? 'Save changes' : 'Edit account info'}
        >
          {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Info')}
        </motion.button>
        
        {isEditing && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            aria-label="Cancel editing"
          >
            Cancel
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default AccountInfo;