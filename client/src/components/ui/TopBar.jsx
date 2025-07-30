import { useState } from 'react';
import { ChevronDown, Bell, User } from 'lucide-react';
import { Button } from './button';

const TopBar = () => {
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const [category, setCategory] = useState('All Categories');

  const handleApplyFilters = () => {
    console.log('Applying filters:', { timeRange, category });
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-white/60 mt-1">Monitor system performance and user engagement</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Time Range Dropdown */}
          <div className="relative">
            <label 
              htmlFor="time-range-select"
              className="text-sm text-white/60 block mb-1"
            >
              Time Range:
            </label>
            <div className="relative w-full rounded-md p-[2px] bg-gradient-to-r from-[#00FFFF] to-[#39FF14]">
              <button
                id="time-range-select"
                className="bg-[#121212] text-white px-4 py-2 rounded-md w-full flex items-center justify-between gap-2 hover:bg-[#1a1a1a] transition-colors"
              >
                <span>{timeRange}</span>
                <ChevronDown className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <label 
              htmlFor="category-select"
              className="text-sm text-white/60 block mb-1"
            >
              Category:
            </label>
            <div className="relative w-full rounded-md p-[2px] bg-gradient-to-r from-[#00FFFF] to-[#39FF14]">
              <button
                id="category-select"
                className="bg-[#121212] text-white px-4 py-2 rounded-md w-full flex items-center justify-between gap-2 hover:bg-[#1a1a1a] transition-colors"
              >
                <span>{category}</span>
                <ChevronDown className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>

          {/* Apply Filters Button */}
          <Button
            onClick={handleApplyFilters}
            className="bg-gradient-to-r from-[#00FFFF] to-[#39FF14] hover:opacity-90 text-black font-bold mt-6 transition-all duration-200 hover:scale-105"
          >
            Apply Filters
          </Button>

          {/* Notifications & Profile */}
          <div className="flex items-center gap-3 ml-4 mt-6">
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
              <Bell className="w-5 h-5 text-white/70" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-[#00FFFF] to-[#39FF14] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;