import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

// Sample user data
const initialUsers = [
  {
    id: "#001",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b332c2cd?w=40&h=40&fit=crop&crop=face",
    role: "Admin",
    status: "Active",
    lastActive: "2 hours ago",
  },
  {
    id: "#002",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    role: "User",
    status: "Active",
    lastActive: "1 day ago",
  },
  {
    id: "#003",
    name: "Emma Davis",
    email: "emma.davis@company.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    role: "User",
    status: "Inactive",
    lastActive: "1 week ago",
  },
  {
    id: "#004",
    name: "John Smith",
    email: "john.smith@company.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    role: "User",
    status: "Active",
    lastActive: "3 hours ago",
  },
  {
    id: "#005",
    name: "Lisa Wong",
    email: "lisa.wong@company.com",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
    role: "User",
    status: "Active",
    lastActive: "5 minutes ago",
  },
  {
    id: "#006",
    name: "Alex Turner",
    email: "alex.turner@company.com",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    role: "User",
    status: "Inactive",
    lastActive: "2 weeks ago",
  },
  {
    id: "#007",
    name: "Maria Garcia",
    email: "maria.garcia@company.com",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
    role: "Admin",
    status: "Active",
    lastActive: "1 hour ago",
  },
  {
    id: "#008",
    name: "David Kim",
    email: "david.kim@company.com",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face",
    role: "User",
    status: "Active",
    lastActive: "4 days ago",
  },
];

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white-800 rounded-xl p-6 border border-gray-700"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
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
const UserRow = ({ user, index, onAction }) => {
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
    return status === "Active"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30";
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
            className="p-1 text-cyan-400 hover:bg-cyan-400/10 rounded"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("edit", user)}
            className="p-1 text-green-400 hover:bg-green-400/10 rounded"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("delete", user)}
            className="p-1 text-red-400 hover:bg-red-400/10 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
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
      <p className="text-gray-400 text-sm ml-4">Showing 1 to 5 of 2,847 results</p>
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
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
            className={`w-8 h-8 rounded ${
              currentPage === page
                ? "bg-cyan-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {page}
          </motion.button>
        ))}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
};

// Main Component
const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Filter and paginate users
  const filteredUsers = useMemo(() => {
    return initialUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        roleFilter === "All Roles" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "All Status" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Calculate stats
  const stats = useMemo(() => {
    const totalUsers = initialUsers.length;
    const activeUsers = initialUsers.filter(
      (u) => u.status === "Active"
    ).length;
    const admins = initialUsers.filter((u) => u.role === "Admin").length;
    const inactive = initialUsers.filter((u) => u.status === "Inactive").length;

    return { totalUsers, activeUsers, admins, inactive };
  }, []);

  const handleAction = (action, user) => {
    console.log(`${action} user:`, user);
    // Implement your action logic here
  };

  return (
    <div className="min-h-screen bg-black-900 text-white">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-400">Manage system users and permissions</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value="2,847"
            icon={Users}
            color="text-cyan-400"
            delay={0.1}
          />
          <StatsCard
            title="Active Users"
            value="2,341"
            icon={UserCheck}
            color="text-green-400"
            delay={0.2}
          />
          <StatsCard
            title="Admins"
            value="12"
            icon={Shield}
            color="text-purple-400"
            delay={0.3}
          />
          <StatsCard
            title="Inactive"
            value="506"
            icon={UserX}
            color="text-red-400"
            delay={0.4}
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
              className="w-full bg-white-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
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
              options={["All Status", "Active", "Inactive"]}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Status"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white-500 hover:bg-white-600 border border-gray-600  text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
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
          className="bg-white-800 rounded-xl border border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black-300">
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
                <AnimatePresence>
                  {currentUsers.map((user, index) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      index={index}
                      onAction={handleAction}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, totalPages)}
            onPageChange={setCurrentPage}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
