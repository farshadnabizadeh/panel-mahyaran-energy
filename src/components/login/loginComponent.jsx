import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import LoginImage from "../../assets/img/Login.jpg";
import fa from "../../locales/fa.json"; // import Persian localization

// Access translation object
const t = fa.loginPage;

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Example submit handler (replace with backend call)
        alert(`ورود موفقیت‌آمیز: ${formData.email}`);
    };

    const InputField = ({ id, name, type, placeholder, value, onChange, icon }) => (
        <div className="relative group">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                {icon}
            </span>
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                className="w-full py-3 pr-10 pl-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 
          focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 
          transition-all duration-200 shadow-sm focus:shadow-md"
            />
        </div>
    );

    return (
        <div
            dir="rtl"
            className="min-h-screen flex flex-col-reverse md:flex-row bg-gradient-to-tr from-slate-50 to-blue-50"
        >
            {/* Right section — Login form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-16 py-10 md:py-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
                    {t.title}
                </h2>
                <p className="text-gray-500 mb-8 text-base sm:text-lg">{t.subtitle}</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Email */}
                    <InputField
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t.fields.email}
                        value={formData.email}
                        onChange={handleChange}
                        icon={<FaEnvelope />}
                    />

                    {/* Password */}
                    <InputField
                        id="password"
                        name="password"
                        type="password"
                        placeholder={t.fields.password}
                        value={formData.password}
                        onChange={handleChange}
                        icon={<FaLock />}
                    />

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="text-blue-600 focus:ring-blue-400 rounded"
                            />
                            <span>{t.fields.rememberMe}</span>
                        </label>
                        <a
                            href="/forgot-password"
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            {t.forgotPassword}
                        </a>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl 
              shadow-md hover:from-blue-700 hover:to-indigo-700 
              focus:ring-4 focus:ring-blue-300 transition-all duration-300"
                    >
                        {t.buttonText}
                    </button>

                    {/* Sign up link */}
                    <div className="text-center mt-6">
                        <span className="text-gray-600">{t.noAccount}</span>
                        <a
                            href="/"
                            className="ml-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        >
                            {t.signUp}
                        </a>
                    </div>
                </form>
            </div>

            {/* Left section — Image */}
            <div className="w-full md:w-1/2 h-64 sm:h-72 md:h-screen relative">
                <img
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    src={LoginImage}
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

export default LoginPage;
