import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Search,
  Users,
  UserCheck,
  Shield,
  UserX,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { BASE_URL } from "../utils/constant";

// Configure axios defaults
axios.defaults.baseURL = `${BASE_URL}/api`;

// Add auth token to requests if available
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, delay, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-gray-800 rounded-xl p-6 border border-gray-700"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className={`text-2xl font-bold ${color} mt-1`}>
          {loading ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            value
          )}
        </p>
      </div>
      <div
        className={`p-3 rounded-lg ${
          color === "text-cyan-400"
            ? "bg-cyan-400/10"
            : color === "text-green-400"
            ? "bg-green-400/10"
            : color === "text-purple-400"
            ? "bg-purple-400/10"
            : "bg-red-400/10"
        }`}
      >
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </motion.div>
);

// Dropdown Component
const Dropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm flex items-center justify-between min-w-[120px]"
      >
        {value || placeholder}
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[120px]"
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// User Row Component
const UserRow = ({ user, index, onAction, loading }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "User":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Inactive":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Suspended":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="border-b border-gray-700/50 hover:bg-gray-800/50 transition-colors"
    >
      <td className="p-4 text-gray-300 font-medium">{user.id}</td>
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;
            }}
          />
          <div>
            <div className="text-white font-medium">{user.name}</div>
            <div className="text-gray-400 text-sm">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
            user.role
          )}`}
        >
          {user.role}
        </span>
      </td>
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            user.status
          )}`}
        >
          {user.status}
        </span>
      </td>
      <td className="p-4 text-gray-400">{user.lastActive}</td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("view", user)}
            disabled={loading}
            className="p-1 text-cyan-400 hover:bg-cyan-400/10 rounded disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("edit", user)}
            disabled={loading}
            className="p-1 text-green-400 hover:bg-green-400/10 rounded disabled:opacity-50"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("delete", user)}
            disabled={loading}
            className="p-1 text-red-400 hover:bg-red-400/10 rounded disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, pagination, loading }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6 mb-6">
      <p className="text-gray-400 text-sm ml-4">
        {pagination ? 
          `Showing ${pagination.showing.from} to ${pagination.showing.to} of ${pagination.showing.total} results` :
          'Loading...'
        }
      </p>
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-3 py-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </motion.button>

        {getPageNumbers().map((page) => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`w-8 h-8 rounded ${
              currentPage === page
                ? "bg-cyan-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            } disabled:opacity-50`}
          >
            {page}
          </motion.button>
        ))}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-3 py-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
};

// Error Alert Component
const ErrorAlert = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        <span className="text-red-200">{error}</span>
      </div>
      <button
        onClick={onClose}
        className="text-red-400 hover:text-red-300"
      >
        ×
      </button>
    </motion.div>
  );
};

// Main Component
const AdminUsersPage = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    inactiveUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const usersPerPage = 5;

  // API Functions
  const fetchUsers = async (page = 1, search = "", role = "", status = "") => {
    try {
      setLoading(page === 1); // Only show loading for first page
      const params = new URLSearchParams({
        page: page.toString(),
        limit: usersPerPage.toString(),
        ...(search && { search }),
        ...(role && role !== "All Roles" && { role }),
        ...(status && status !== "All Status" && { status })
      });

      const response = await axios.get(`/users?${params}`);
      
      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Fetch users error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      setUsers([]);
      setPagination(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/users/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
      // Don't show error for stats, just keep old data
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`/users/${userId}`);
      if (response.data.success) {
        // Refresh current page
        await fetchUsers(currentPage, searchTerm, roleFilter, statusFilter);
        await fetchStats();
        return true;
      }
    } catch (err) {
      console.error('Delete user error:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
      return false;
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const response = await axios.patch(`/users/${userId}/toggle-status`);
      if (response.data.success) {
        // Refresh current page
        await fetchUsers(currentPage, searchTerm, roleFilter, statusFilter);
        await fetchStats();
        return true;
      }
    } catch (err) {
      console.error('Toggle user status error:', err);
      setError(err.response?.data?.message || 'Failed to update user status');
      return false;
    }
  };

  // Effect hooks
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, searchTerm, roleFilter, statusFilter);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, roleFilter, statusFilter]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchUsers(currentPage, searchTerm, roleFilter, statusFilter);
        fetchStats();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentPage, searchTerm, roleFilter, statusFilter, loading]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page, searchTerm, roleFilter, statusFilter);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchUsers(currentPage, searchTerm, roleFilter, statusFilter),
      fetchStats()
    ]);
  };

  // Handle user actions
  const handleAction = async (action, user) => {
    console.log(`${action} user:`, user);
    
    switch (action) {
      case "view":
        // Implement view user details
        alert(`Viewing user: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.status}`);
        break;
        
      case "edit":
        // Implement edit user (could open a modal)
        const newRole = user.role === "Admin" ? "User" : "Admin";
        if (confirm(`Change ${user.name}'s role from ${user.role} to ${newRole}?`)) {
          try {
            const response = await axios.put(`/users/${user.id || user._id}`, {
              role: newRole
            });
            if (response.data.success) {
              await fetchUsers(currentPage, searchTerm, roleFilter, statusFilter);
              await fetchStats();
            }
          } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user');
          }
        }
        break;
        
      case "delete":
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
          await deleteUser(user.id || user._id);
        }
        break;
        
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  const handleAddUser = () => {
    // Implement add user functionality
    const name = prompt("Enter user name:");
    if (!name) return;
    
    const email = prompt("Enter user email:");
    if (!email) return;
    
    const username = prompt("Enter username:");
    if (!username) return;

    // Create user
    axios.post('/users', {
      name,
      email,
      username,
      password: 'password123', // Default password
      role: 'User',
      status: 'Active'
    }).then(response => {
      if (response.data.success) {
        fetchUsers(currentPage, searchTerm, roleFilter, statusFilter);
        fetchStats();
        alert('User created successfully!');
      }
    }).catch(err => {
      setError(err.response?.data?.message || 'Failed to create user');
    });
  };

  // Calculate totals for display
  const totalPages = pagination?.pages || 1;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                User Management
              </h1>
              <p className="text-gray-400">Manage system users and permissions</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          <ErrorAlert error={error} onClose={() => setError(null)} />
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            color="text-cyan-400"
            delay={0.1}
            loading={loading}
          />
          <StatsCard
            title="Active Users"
            value={stats.activeUsers.toLocaleString()}
            icon={UserCheck}
            color="text-green-400"
            delay={0.2}
            loading={loading}
          />
          <StatsCard
            title="Admins"
            value={stats.adminUsers.toLocaleString()}
            icon={Shield}
            color="text-purple-400"
            delay={0.3}
            loading={loading}
          />
          <StatsCard
            title="Inactive"
            value={stats.inactiveUsers.toLocaleString()}
            icon={UserX}
            color="text-red-400"
            delay={0.4}
            loading={loading}
          />
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex gap-3">
            <Dropdown
              options={["All Roles", "Admin", "User"]}
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder="All Roles"
            />
            <Dropdown
              options={["All Status", "Active", "Inactive", "Suspended"]}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Status"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddUser}
              className="bg-cyan-500 hover:bg-cyan-600 border border-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add User</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    ID
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    User
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Role
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Status
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Last Active
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-400">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {users.map((user, index) => (
                      <UserRow
                        key={user._id || user.id}
                        user={user}
                        index={index}
                        onAction={handleAction}
                        loading={loading}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, totalPages)}
            onPageChange={handlePageChange}
            pagination={pagination}
            loading={loading}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminUsersPage;