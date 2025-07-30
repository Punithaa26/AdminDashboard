import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/ui/Sidebar";
import TopBar from "../components/ui/TopBar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-0" : "ml-0 md:ml-[20%]"}`}>
        {/* Toggle on Mobile */}
        <div className="md:hidden p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-[#1a1a1a] text-white px-4 py-2 rounded-md"
          >
            ☰ Menu
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
