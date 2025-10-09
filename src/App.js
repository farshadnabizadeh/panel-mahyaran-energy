import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Counter from "./components/example/exampleComponent";
import RegisterForm from "./components/register/registerComponent";
const Home = () => {
  return (
    <div className="w-full min-h-screen">
      <RegisterForm />
    </div>
  )
}
const About = () => {
  return (
    <div className="w-full min-h-screen border-2 border-[red]">
      <Counter />
    </div>
  )
}
export default function App() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}
