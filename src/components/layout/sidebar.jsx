import React from "react";
import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaUser,
    FaCog,
    FaInfoCircle,
    FaSignOutAlt,
    FaTimes,
    FaNetworkWired,
} from "react-icons/fa";
import fa from "../../locales/fa.json";

const t = fa.panel.sidebar;

export default function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Overlay on small screens */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            ></div>

            {/* Sidebar panel */}
            <div
                dir="rtl"
                className={`fixed top-0 right-0 z-50 w-64 h-full bg-gradient-to-b from-blue-700 to-indigo-800 text-white flex flex-col py-6 px-4 transform transition-transform duration-300 shadow-lg 
        ${isOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0`}
            >
                {/* Close button (mobile) */}
                <button
                    className="md:hidden self-start mb-4 text-white hover:text-gray-200"
                    onClick={onClose}
                >
                    <FaTimes size={22} />
                </button>

                <h1 className="text-2xl font-bold mb-8 text-center">{t.title}</h1>

                <nav className="flex flex-col space-y-4">
                    <NavLink
                        to="/panel"
                        end
                        onClick={onClose}
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
                        onClick={onClose}
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
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition ${isActive ? "bg-white/20 font-semibold" : ""
                            }`
                        }
                    >
                        <FaCog />
                        <span>{t.menu.settings}</span>
                    </NavLink>
                    <NavLink
                        to="/panel/network"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition ${isActive ? "bg-white/20 font-semibold" : ""
                            }`
                        }
                    >
                        <FaNetworkWired />
                        <span>{t.menu.network}</span>
                    </NavLink>
                    <NavLink
                        to="/login"
                        onClick={onClose}
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
        </>
    );
}
