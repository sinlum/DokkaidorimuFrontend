import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaGlobeAfrica } from "react-icons/fa";
import {
  FaHome,
  FaFlask,
  FaClock,
  FaBookReader,
  FaPray,
  FaPiggyBank,
  FaUsers,
  FaTrophy,
} from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { href: "/", icon: FaHome, label: "ホーム", color: "text-pink-400" },
    { href: "/science", icon: FaFlask, label: "科学", color: "text-cyan-400" },
    {
      href: "/history",
      icon: FaClock,
      label: "歴史",
      color: "text-yellow-400",
    },
    {
      href: "/biography",
      icon: FaBookReader,
      label: "伝記",
      color: "text-purple-400",
    },
    { href: "/religion", icon: FaPray, label: "宗教", color: "text-blue-400" },
    {
      href: "/economic",
      icon: FaPiggyBank,
      label: "経済",
      color: "text-green-400",
    },
    {
      href: "/politics",
      icon: FaGlobeAfrica,
      label: "政治",
      color: "text-orange-400",
    },
    {
      href: "/leaderboard",
      icon: FaTrophy,
      label: "ランキング",
      color: "text-red-400",
    },
  ];

  return (
    <div
      className={`fixed top-0 md:mt-12 mt-3 left-0 h-full ${
        collapsed ? "w-20" : "w-[185px]"
      } bg-gradient-to-br from-yellow-200 via-pink-200 to-cyan-200 text-gray-800 flex flex-col transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-all duration-300 md:translate-x-0 z-40 rounded-r-3xl shadow-lg overflow-hidden`}
    >
      <div className="flex-shrink-0 p-4 flex justify-between items-center bg-white bg-opacity-50 backdrop-blur-sm">
        {/* <div className="text-2xl font-bold text-purple-600 transition-all duration-300">
          {!collapsed ? "キッズペディア" : "KP"}
        </div> */}
        <button
          onClick={toggleCollapse}
          className="md:hidden text-purple-600 hover:text-purple-800 transition-colors duration-200"
        >
          <FaBars />
        </button>
      </div>
      <div className="flex-grow p-4 space-y-4 text-md overflow-y-auto">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center space-x-3 hover:bg-white hover:bg-opacity-60 p-3 rounded-2xl transition-all duration-200 group"
          >
            <div
              className={`p-2 rounded-full ${item.color} bg-white bg-opacity-70 group-hover:bg-opacity-90 transition-all duration-200`}
            >
              <item.icon
                size={collapsed ? 24 : 20}
                className="transition-all duration-200"
              />
            </div>
            {!collapsed && (
              <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
