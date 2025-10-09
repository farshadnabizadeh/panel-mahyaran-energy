import React from "react";
import { Routes, Route, Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full min-h-screen border-2 border-[blue]">

    </div>
  )
}
const About = () => {
  return (
    <div className="w-full min-h-screen border-2 border-[red]">

    </div>
  )
}
export default function App() {
  return (
    <div className="p-6">
      <nav className="space-x-4">
        <Link to="/" className="text-blue-500">Home</Link>
        <Link to="/about" className="text-blue-500">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}
