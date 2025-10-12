import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Swal from 'sweetalert2'; // Import SweetAlert2
import LoginImage from "../../assets/img/Login.jpg";
import fa from "../../locales/fa.json"; // import Persian localization
import { useNavigate } from "react-router-dom";

// API function for login
const loginUser = async (userData) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'; // Update with your Laravel API URL
    
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(JSON.stringify(data.errors || { general: data.message || 'Login failed' }));
    }

    return data;
};

// Access translation object
const t = fa.loginPage;

// --- SOLUTION: Move InputField outside the LoginPage component ---
// Also, wrap it with React.memo for performance optimization.
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
            className="w-full py-3 pr-10 pl-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 
      focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 
      transition-all duration-200 shadow-sm focus:shadow-md"
        />
    </div>
));

// The LoginPage component remains largely the same internally.
const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
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
            const response = await loginUser({
                email: formData.email,
                password: formData.password,
            });

            // Store token and user data in localStorage/sessionStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Show success message
            Swal.fire({
                icon: 'success',
                title: '<div style="direction: rtl; text-align: right;">موفقیت</div>',
                text: response.message || 'ورود با موفقیت انجام شد ✅',
                confirmButtonText: 'ادامه',
                confirmButtonColor: '#28a745',
                customClass: {
                    popup: 'text-right',
                    content: 'text-right'
                },
                width: 400,
                padding: '1.5em'
            });

            // Navigate to panel
            navigate("/panel");

        } catch (err) {
            // Handle validation errors from Laravel
            try {
                const errorData = JSON.parse(err.message);
                
                if (errorData.errors) {
                    // Convert all validation errors to a single string
                    const allErrors = Object.entries(errorData.errors)
                        .map(([field, messages]) => {
                            // Map field names to user-friendly names
                            const fieldNames = {
                                'email': 'ایمیل',
                                'password': 'رمز عبور'
                            };
                            
                            const fieldName = fieldNames[field] || field.replace('_', ' ');
                            return `${fieldName}: ${messages[0]}`;
                        })
                        .join('\n\n');
                    
                    // Show all validation errors in SweetAlert
                    Swal.fire({
                        icon: 'error',
                        title: '<div style="direction: rtl; text-align: right;">خطاهای ورود</div>',
                        html: `<div style="direction: rtl; text-align: right; font-size: 1rem; line-height: 1.6;">${allErrors.replace(/\n\n/g, '<br><br>')}</div>`,
                        confirmButtonText: 'متوجه شدم',
                        confirmButtonColor: '#d33',
                        customClass: {
                            popup: 'text-right',
                            content: 'text-right'
                        },
                        width: 500,
                        padding: '1.5em'
                    });
                } else {
                    // Handle general errors (like wrong email/password)
                    Swal.fire({
                        icon: 'error',
                        title: '<div style="direction: rtl; text-align: right;">خطا</div>',
                        text: errorData.general || 'ورود با خطا مواجه شد',
                        confirmButtonText: 'متوجه شدم',
                        confirmButtonColor: '#d33',
                        customClass: {
                            popup: 'text-right',
                            content: 'text-right'
                        },
                        width: 400,
                        padding: '1.5em'
                    });
                }
            } catch (parseErr) {
                // Handle JSON parsing errors
                Swal.fire({
                    icon: 'error',
                    title: '<div style="direction: rtl; text-align: right;">خطا</div>',
                    text: 'ورود با خطا مواجه شد',
                    confirmButtonText: 'متوجه شدم',
                    confirmButtonColor: '#d33',
                    customClass: {
                        popup: 'text-right',
                        content: 'text-right'
                    },
                    width: 400,
                    padding: '1.5em'
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
                        disabled={loading}
                        className={`w-full font-bold py-4 rounded-xl shadow-md transition-all duration-300 ${
                            loading
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