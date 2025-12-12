import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from './components/auth/PrivateRoute'; // Import PrivateRoute
import PublicRoute from './components/auth/PublicRoute'; // Import PublicRoute

import Counter from "./components/example/exampleComponent";
import RegisterForm from "./components/register/registerComponent";
import LoginComponent from "./components/login/loginComponent";
import ForgotPasswordPage from "./components/forgotPassword/ForgotPasswordPage";
import PanelLayout from "./components/layout/panelLayout";
import DashboardHome from "./components/dashboard/dashboardHome";
import ProfileComponent from "./components/dashboard/profileComponent";
import NetworkComponent from "./components/dashboard/networkComponent";
import SupportComponent from "./components/dashboard/supportComponent";
export default function App() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <PublicRoute>
            <RegisterForm />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <LoginComponent />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        } />
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
          <Route path="support" element={<SupportComponent/>} />
          {/* <Route path="settings" element={<div>تنظیمات</div>} /> */}
        </Route>
      </Routes>
    </div>
  );
}