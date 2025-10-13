import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from './components/auth/PrivateRoute'; // Import PrivateRoute

import Counter from "./components/example/exampleComponent";
import RegisterForm from "./components/register/registerComponent";
import LoginComponent from "./components/login/loginComponent";
import ForgotPasswordPage from "./components/forgotPassword/ForgotPasswordPage";
import PanelLayout from "./components/layout/panelLayout";
import DashboardHome from "./components/dashboard/dashboardHome";
import ProfileComponent from "./components/dashboard/profileComponent";
import NetworkComponent from "./components/dashboard/networkComponent";
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
        <Route path="/panel" element={
            <PrivateRoute>
                <PanelLayout />
            </PrivateRoute>
        }>
          <Route index element={<DashboardHome />} />
          {/* other routes inside panel */}
          <Route path="profile" element={<ProfileComponent/>} />
          <Route path="network" element={<NetworkComponent/>} />
          <Route path="settings" element={<div>تنظیمات</div>} />
        </Route>
      </Routes>
    </div>
  );
}