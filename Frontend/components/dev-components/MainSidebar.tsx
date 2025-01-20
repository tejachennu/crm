"use client"

import React, { useState, useEffect, ReactNode } from "react";
import {
  Menu,
  X,
  Home,
  Calendar,
  Users,
  LogOut,
  User2,
  TrainTrack,
  Instagram,
  Facebook
} from "lucide-react";

interface MainSidebarProps {
  children: ReactNode;
}

const MainSidebar: React.FC<MainSidebarProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = localStorage.getItem("darkMode") === "true";
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      }
    }
    const role = localStorage.getItem("role");
    setUser(localStorage.getItem("userName"));
    setUserRole(role);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", (!isDarkMode).toString());
      document.documentElement.classList.toggle("dark");
    }
  };

  const logout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const navItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Instgram", icon: Instagram, href: "/instgram" },
    { name: "Facebook", icon: Facebook, href: "/facebook" },
  ];

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-4 py-3 lg:px-6 lg:pl-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Toggle sidebar</span>
                {isSidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <a href="#" className="flex items-center ml-2 md:mr-24">
                <img
                  src="https://res.cloudinary.com/daact80ci/image/upload/v1736360991/jqxypajcwrkg15shorps.avif"
                  className="h-8 mr-3"
                  alt="BLS India Canada"
                />
                <span className="self-center text-xl font-semibold text-black sm:text-2xl whitespace-nowrap dark:text-white">
                  CRM
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Toggle dark mode</span>
                {isDarkMode ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="flex flex-col justify-between h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <item.icon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ml-3">{item.name}</span>
                </a>
              </li>
            ))}

            <li>
              <a
                onClick={logout}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <LogOut className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ml-3">Logout</span>
              </a>
            </li>
          </ul>

          <div className="flex mb-4 ">
            <User2 className="w-6 h-6 text-gray-500 transition duration-75 " />
            <p className="ml-2 text-black dark:text-white ">{user}</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="p-4 pt-20 md:ml-64">{children}</div>
    </div>
  );
};

export default MainSidebar;
