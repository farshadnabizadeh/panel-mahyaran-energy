import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "./sidebar";

export default function PanelLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div dir="rtl" className="flex flex-row-reverse min-h-screen bg-gray-50">
      {/* Sidebar (always fixed on the right) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 md:mr-64 p-5 md:p-8 overflow-y-auto w-full">
        {/* Mobile header with menu toggle */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-blue-700 p-2 rounded-md hover:bg-blue-100 transition"
          >
            <FaBars size={22} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">پنل کاربری</h1>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
