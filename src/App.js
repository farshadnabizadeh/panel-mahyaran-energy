import React from "react";
import { Routes, Route } from "react-router-dom";

import Counter from "./components/example/exampleComponent";
import RegisterForm from "./components/register/registerComponent";
import LoginComponent from "./components/login/loginComponent";
import ForgotPasswordPage from "./components/forgotPassword/ForgotPasswordPage";
import PanelLayout from "./components/layout/panelLayout";
import DashboardHome from "./components/dashboard/dashboardHome";
import NetworkComponent from "./components/dashboard/network/networkComponent";
export default function App() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<RegisterForm />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/about" element={<Counter />} />

        {/* Panel layout (private routes) */}
        <Route path="/panel" element={<PanelLayout />}>
          <Route index element={<DashboardHome />} />
          {/* other routes inside panel */}
          <Route path="profile" element={<div>پروفایل کاربر</div>} />
          <Route path="settings" element={<div>تنظیمات</div>} />
          <Route path="network" element={<NetworkComponent />} />
        </Route>
      </Routes>
    </div>
  );
}
