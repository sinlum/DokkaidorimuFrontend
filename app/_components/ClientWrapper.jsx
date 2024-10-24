// app/_components/ClientWrapper.js
"use client";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useUser } from "./userContext";

export default function ClientWrapper({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  if (!user) {
    return null; // or return a loading indicator
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden pt-16">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-purple-100 to-pink-100 p-4 md:pl-[200px]">
          {children}
        </main>
      </div>
    </div>
  );
}
