import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Video,
  Image,
  File,
} from "lucide-react";

// Sample content data
const initialContent = [
  {
    id: "#001",
    title: "Getting Started with React",
    description: "A comprehensive guide for beginners",
    type: "Article",
    status: "Published",
    createdBy: {
      name: "You",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b332c2cd?w=40&h=40&fit=crop&crop=face",
    },
    createdOn: "2025-01-14",
    lastModified: "2 hours ago",
  },
  {
    id: "#002",
    title: "Advanced CSS Techniques",
    description: "Modern CSS features and best practices",
    type: "Video",
    status: "Pending",
    createdBy: {
      name: "Team (2 Members)",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
    createdOn: "2025-01-13",
    lastModified: "1 day ago",
  },
  {
    id: "#003",
    title: "JavaScript Best Practices",
    description: "Clean code principles for Javascript developers",
    type: "Article",
    status: "Rejected",
    createdBy: {
      name: "You",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    },
    createdOn: "2025-01-13",
    lastModified: "3 days ago",
  },
  {
    id: "#004",
    title: "Node.js Fundamentals",
    description: "Backend development with Node.js",
    type: "Video",
    status: "Published",
    createdBy: {
      name: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    createdOn: "2025-01-12",
    lastModified: "5 hours ago",
  },
  {
    id: "#005",
    title: "Database Design Patterns",
    description: "Scalable database architecture",
    type: "Document",
    status: "Published",
    createdBy: {
      name: "Mike Chen",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
    },
    createdOn: "2025-01-11",
    lastModified: "1 week ago",
  },
  {
    id: "#006",
    title: "API Development Guide",
    description: "RESTful API design and implementation",
    type: "Article",
    status: "Pending",
    createdBy: {
      name: "Emma Davis",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    },
    createdOn: "2025-01-10",
    lastModified: "2 weeks ago",
  },
  {
    id: "#007",
    title: "Mobile App Development",
    description: "Cross-platform mobile development",
    type: "Video",
    status: "Published",
    createdBy: {
      name: "Alex Turner",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
    },
    createdOn: "2025-01-09",
    lastModified: "3 weeks ago",
  },
  {
    id: "#008",
    title: "DevOps Essentials",
    description: "Continuous integration and deployment",
    type: "Document",
    status: "Rejected",
    createdBy: {
      name: "David Kim",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face",
    },
    createdOn: "2025-01-08",
    lastModified: "1 month ago",
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
            : color === "text-orange-400"
            ? "bg-orange-400/10"
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

// Content Row Component
const ContentRow = ({ content, index, onAction }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "Video":
        return Video;
      case "Document":
        return File;
      case "Article":
      default:
        return FileText;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Video":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Document":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Article":
      default:
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const TypeIcon = getTypeIcon(content.type);

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="border-b border-gray-700/50 hover:bg-gray-800/50 transition-colors"
    >
      <td className="p-4 text-gray-300 font-medium">{content.id}</td>
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor(content.type)}`}>
            <TypeIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-white font-medium">{content.title}</div>
            <div className="text-gray-400 text-sm">{content.description}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(
            content.type
          )}`}
        >
          {content.type}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <img
            src={content.createdBy.avatar}
            alt={content.createdBy.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-gray-300 text-sm">
            {content.createdBy.name}
          </span>
        </div>
      </td>
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            content.status
          )}`}
        >
          {content.status}
        </span>
      </td>
      <td className="p-4 text-gray-400">{content.createdOn}</td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("view", content)}
            className="p-1 text-cyan-400 hover:bg-cyan-400/10 rounded"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("edit", content)}
            className="p-1 text-green-400 hover:bg-green-400/10 rounded"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAction("delete", content)}
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
      <p className="text-gray-400 text-sm ml-4">
        Showing 1 to 5 of 2,947 results
      </p>
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
const AdminContentPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const contentPerPage = 3;

  // Filter and paginate content
  const filteredContent = useMemo(() => {
    return initialContent.filter((content) => {
      const matchesSearch =
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        typeFilter === "All Types" || content.type === typeFilter;
      const matchesStatus =
        statusFilter === "All Status" || content.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredContent.length / contentPerPage);
  const currentContent = filteredContent.slice(
    (currentPage - 1) * contentPerPage,
    currentPage * contentPerPage
  );

  // Calculate stats
  const stats = useMemo(() => {
    const totalContent = initialContent.length;
    const published = initialContent.filter(
      (c) => c.status === "Published"
    ).length;
    const pending = initialContent.filter((c) => c.status === "Pending").length;
    const rejected = initialContent.filter(
      (c) => c.status === "Rejected"
    ).length;

    return { totalContent, published, pending, rejected };
  }, []);

  const handleAction = (action, content) => {
    console.log(`${action} content:`, content);
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
            Content Management
          </h1>
          <p className="text-gray-400">
            Manage your digital content efficiently
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Content"
            value="2,847"
            icon={FileText}
            color="text-cyan-400"
            delay={0.1}
          />
          <StatsCard
            title="Published"
            value="1,923"
            icon={CheckCircle}
            color="text-green-400"
            delay={0.2}
          />
          <StatsCard
            title="Pending"
            value="124"
            icon={Clock}
            color="text-orange-400"
            delay={0.3}
          />
          <StatsCard
            title="Rejected"
            value="89"
            icon={XCircle}
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
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex gap-3">
            <Dropdown
              options={["All Types", "Article", "Video", "Document"]}
              value={typeFilter}
              onChange={setTypeFilter}
              placeholder="All Types"
            />
            <Dropdown
              options={["All Status", "Published", "Pending", "Rejected"]}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Status"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white-500 hover:bg-white-600 border border-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Content</span>
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
                    Title
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Type
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Created By
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Status
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Created On
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {currentContent.map((content, index) => (
                    <ContentRow
                      key={content.id}
                      content={content}
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

export default AdminContentPage;
