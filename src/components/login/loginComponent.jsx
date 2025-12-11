// src/components/login/loginComponent.jsx
import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa"; // Changed FaEnvelope to FaUser
import Swal from 'sweetalert2';
import LoginImage from "../../assets/img/Login.jpg";
import fa from "../../locales/fa.json";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../requests/api";

const t = fa.loginPage;

const InputField = React.memo(({ id, name, type, placeholder, value, onChange, icon }) => (
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
            className="w-full py-3 pr-10 pl-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm focus:shadow-md"
        />
    </div>
));

const LoginPage = () => {
    const navigate = useNavigate();
    
    // 1. Change email to username in state
    const [formData, setFormData] = useState({
        username: "", 
        password: "",
        rememberMe: false,
    });
    
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 2. Send username instead of email to API
            const response = await apiCall('POST', '/login', {
                username: formData.username,
                password: formData.password,
            });

            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            Swal.fire({
                icon: 'success',
                title: 'موفقیت',
                text: response.message,
                confirmButtonText: 'ادامه',
                confirmButtonColor: '#28a745',
                customClass: { popup: 'rtl-popup', content: 'rtl-content' },
            });

            navigate("/panel");

        } catch (err) { 
            if (err.status === 422 && err.errors) {
                const allErrors = Object.values(err.errors).map(messages => messages[0]).join('<br>');
                
                Swal.fire({
                    icon: 'error',
                    title: 'خطای اعتبارسنجی',
                    html: `<div class="rtl-content">${allErrors}</div>`,
                    confirmButtonText: 'متوجه شدم',
                    confirmButtonColor: '#d33',
                    customClass: { popup: 'rtl-popup' },
                });

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'خطا در ورود',
                    text: err.message,
                    confirmButtonText: 'متوجه شدم',
                    confirmButtonColor: '#d33',
                    customClass: { popup: 'rtl-popup', content: 'rtl-content' },
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            dir="rtl"
            className="min-h-screen flex flex-col-reverse md:flex-row bg-gradient-to-tr from-slate-50 to-blue-50"
        >
            <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-16 py-10 md:py-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
                    {t.title}
                </h2>
                <p className="text-gray-500 mb-8 text-base sm:text-lg">{t.subtitle}</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* 3. Username Input Field */}
                    <InputField
                        id="username"
                        name="username" 
                        type="text" 
                        placeholder="نام کاربری" // Or use t.fields.username if you add it to JSON
                        value={formData.username}
                        onChange={handleChange}
                        icon={<FaUser />} 
                    />

                    <InputField
                        id="password"
                        name="password"
                        type="password"
                        placeholder={t.fields.password}
                        value={formData.password}
                        onChange={handleChange}
                        icon={<FaLock />}
                    />

                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <label className="flex items-center gap-2 cursor-pointer">
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

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full font-bold py-4 rounded-xl shadow-md transition-all duration-300 ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t.loading || 'در حال پردازش...'}
                            </span>
                        ) : (
                            t.buttonText
                        )}
                    </button>

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
