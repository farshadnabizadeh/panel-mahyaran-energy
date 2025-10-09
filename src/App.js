import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Counter from "./components/example/exampleComponent";
import RegisterForm from "./components/register/registerComponent";
import LoginComponent from "./components/login/loginComponent";
import ForgotPasswordPage from "./components/forgotPassword/ForgotPasswordPage";
export default function App() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path="/" element={<RegisterForm />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/about" element={<Counter />} />
      </Routes>
    </div>
  );
}
