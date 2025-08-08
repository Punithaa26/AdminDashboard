// File: /src/components/ui/AccountInfo.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';

const AccountInfo = () => {
  const [userInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Administrator'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEditInfo = () => {
    setIsEditing(!isEditing);
    // Handle edit info logic here
    console.log('Edit info requested');
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
        <p className="text-gray-400 text-sm">View and update your account details like name and email.</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            value={userInfo.name}
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
            value={userInfo.email}
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
            Role
          </label>
          <input
            type="text"
            value={userInfo.role}
            readOnly
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white opacity-50 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleEditInfo}
          className={`flex-1 font-medium py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
            isEditing
              ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
              : 'bg-yellow-500 hover:bg-yellow-600 text-black focus:ring-yellow-500'
          }`}
          aria-label={isEditing ? 'Save changes' : 'Edit account info'}
        >
          {isEditing ? 'Save Changes' : 'Edit Info'}
        </motion.button>
        
        {isEditing && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsEditing(false)}
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