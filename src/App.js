import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Counter from "./components/example/exampleComponent";
import RegisterForm from "./components/register/registerComponent";
import LoginComponent from "./components/login/loginComponent";

export default function App() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path="/" element={<RegisterForm />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/about" element={<Counter />} />
      </Routes>
    </div>
  );
}
