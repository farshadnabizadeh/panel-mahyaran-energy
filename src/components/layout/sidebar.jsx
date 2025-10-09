import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaUser, FaCog, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";
import fa from "../../locales/fa.json";

const t = fa.panel.sidebar;

export default function Sidebar() {
    return (
        <div
            dir="rtl"
            className="bg-gradient-to-b from-blue-700 to-indigo-800 text-white w-64 h-screen flex flex-col py-6 px-4"
        >
            <h1 className="text-2xl font-bold mb-8 text-center">{t.title}</h1>

            <nav className="flex flex-col space-y-4">
                <NavLink
                    to="/panel"
                    end
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition ${isActive ? "bg-white/20 font-semibold" : ""
                        }`
                    }
                >
                    <FaHome />
                    <span>{t.menu.dashboard}</span>
                </NavLink>

                <NavLink
                    to="/panel/profile"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition ${isActive ? "bg-white/20 font-semibold" : ""
                        }`
                    }
                >
                    <FaUser />
                    <span>{t.menu.profile}</span>
                </NavLink>

                <NavLink
                    to="/panel/settings"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition ${isActive ? "bg-white/20 font-semibold" : ""
                        }`
                    }
                >
                    <FaCog />
                    <span>{t.menu.settings}</span>
                </NavLink>

                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition ${isActive ? "bg-white/20 font-semibold" : ""
                        }`
                    }
                >
                    <FaInfoCircle />
                    <span>{t.menu.about}</span>
                </NavLink>
            </nav>

            <div className="mt-auto border-t border-white/20 pt-4 text-center">
                <button className="flex items-center gap-2 justify-center w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                    <FaSignOutAlt />
                    <span>{t.menu.logout}</span>
                </button>
            </div>
        </div>
    );
}
