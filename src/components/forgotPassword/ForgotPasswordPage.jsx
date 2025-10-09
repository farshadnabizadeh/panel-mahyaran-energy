import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import ForgotImage from "../../assets/img/Login.jpg"; // You can reuse Login.jpg if needed
import fa from "../../locales/fa.json";

const t = fa.forgotPasswordPage

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(t.alerts.success);
    };

    return (
        <div
            dir="rtl"
            className="min-h-screen flex flex-col-reverse md:flex-row bg-gradient-to-tr from-slate-50 to-blue-50"
        >
            {/* Right: Form section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-16 py-10 md:py-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
                    {t.title}
                </h2>
                <p className="text-gray-500 mb-8 text-base sm:text-lg">{t.subtitle}</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Email Field */}
                    <div className="relative group">
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <FaEnvelope />
                        </span>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t.fields.email}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full py-3 pr-10 pl-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 
                focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 
                transition-all duration-200 shadow-sm focus:shadow-md"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl 
              shadow-md hover:from-blue-700 hover:to-indigo-700 
              focus:ring-4 focus:ring-blue-300 transition-all duration-300"
                    >
                        {t.buttonText}
                    </button>

                    {/* Back to login link */}
                    <div className="text-center mt-6">
                        <a
                            href="/login"
                            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        >
                            {t.backToLogin}
                        </a>
                    </div>
                </form>
            </div>

            {/* Left: Image section */}
            <div className="w-full md:w-1/2 h-64 sm:h-72 md:h-screen relative">
                <img
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    src={ForgotImage}
                    alt={t.image.alt}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center md:justify-start md:pr-16 pb-12 sm:pb-16 text-right">
                    <div className="text-white drop-shadow-lg px-4">
                        <h1 className="text-3xl sm:text-4xl font-bold">{t.image.overlayTitle}</h1>
                        <p className="mt-3 text-base sm:text-lg opacity-90">
                            {t.image.overlaySubtitle}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
