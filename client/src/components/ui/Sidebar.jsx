import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Activity, 
  Settings, 
  Database
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'users', icon: Users, label: 'Users', path: '/admin/users' },
    { id: 'content', icon: FileText, label: 'Content', path: '/admin/content' },
    { id: 'analytics', icon: Activity, label: 'Analytics', path: '/admin/analytics' },
    { id: 'logs', icon: Database, label: 'System Logs', path: '/admin/logs' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/admin/settings' }
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
          <div className="w-8 h-8 bg-gradient-to-r from-[#00FFFF] to-[#39FF14] rounded-lg flex items-center justify-center">
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
                  ? 'bg-gradient-to-r from-[#00FFFF]/20 to-[#39FF14]/20 text-[#00FFFF] border border-[#00FFFF]/30' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;