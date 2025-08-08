// File: /src/components/Sidebar.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  FileText,
  Activity,
  Settings,
  Database,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtil";
import { BASE_URL } from "../../utils/constant";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      showSuccessToast("Logout successfully!");
      navigate("/login");
    } catch (error) {
      console.log("failed to logout" + error);
      showErrorToast("Failed to Logout! Try agian!");
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      icon: BarChart3,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    { id: "users", icon: Users, label: "Users", path: "/admin/users" },
    { id: "content", icon: FileText, label: "Content", path: "/admin/content" },
    {
      id: "analytics",
      icon: Activity,
      label: "Analytics",
      path: "/admin/analytics",
    },
    { 
      id: "system-logs", 
      icon: Database, 
      label: "System Logs", 
      path: "/admin/system-logs" 
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      path: "/admin/settings",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 h-screen bg-[#1a1a1a] fixed left-0 top-0 border-r border-white/10">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#e3dddc] rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-black" />
          </div>
          <span className="text-white text-xl font-bold">AdminCore</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path);
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? "border border-gray-300"
                  : "text-gray-500 hover:border border-gray-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      {/* Logout Button */}
      <div className="px-4 m-4 border-t border-gray-100/10">
        <button
          onClick={handleLogout}
          className="w-full mt-4 flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 text-red-500 hover:bg-red-500/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h4a2 2 0 002-2v-1m-8 0v-1a2 2 0 00-2-2H3a2 2 0 00-2 2v1"
            />
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;