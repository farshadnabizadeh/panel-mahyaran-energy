import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

export default function PanelLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
