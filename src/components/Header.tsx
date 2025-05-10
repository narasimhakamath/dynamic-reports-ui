import React, { useState, useRef, useEffect } from 'react';
import {
  Menu, Bell, Search, Sun, Moon, User, Settings, HelpCircle, LogOut,
  PanelLeftClose, PanelLeft
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  openSidebar: () => void;
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({
  openSidebar,
  toggleSidebar,
  isSidebarCollapsed
}) => {
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={openSidebar}
          >
            <Menu size={20} />
          </button>

          <button
            className="hidden md:flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
          </button>

          <div className={`
            relative hidden md:flex items-center
            ${searchFocused ? 'w-96' : 'w-64'} 
            transition-all duration-300 ease-in-out
          `}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-100 dark:bg-gray-700/60 text-gray-800 dark:text-gray-200 w-full py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 transition-all duration-200"
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative">
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>
          
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setProfileOpen(!profileOpen)} 
              className="flex items-center gap-2 p-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 focus:outline-none"
            >
              <img 
                src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150" 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-700"
              />
              <span className="hidden md:block text-sm font-medium">Alex Morgan</span>
            </button>
            
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Alex Morgan</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">alex.morgan@example.com</p>
                </div>
                <div className="p-1">
                  <a 
                    href="#" 
                    className="flex items-center gap-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                  >
                    <User size={16} />
                    <span className="text-sm">View Profile</span>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center gap-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                  >
                    <Settings size={16} />
                    <span className="text-sm">Settings</span>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center gap-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                  >
                    <HelpCircle size={16} />
                    <span className="text-sm">Help Center</span>
                  </a>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <a 
                    href="#" 
                    className="flex items-center gap-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Log Out</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;