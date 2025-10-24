// src/components/login/loginComponent.jsx
import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Swal from 'sweetalert2';
import LoginImage from "../../assets/img/Login.jpg";
import fa from "../../locales/fa.json"; // Persian translation file
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../utils/api"; // Import the central, robust apiCall utility

// Get translation strings for the login page
const t = fa.loginPage;

// Memoized InputField component for performance
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
    
    // State for form fields
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false, // Optional: 'remember me' checkbox
    });
    
    // State to manage loading status for the submit button
    const [loading, setLoading] = useState(false);

    // Generic change handler for all form inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);

        try {
            // --- BEST PRACTICE: Use the central apiCall function directly ---
            // This replaces the need for a separate `loginUser` utility function.
            const response = await apiCall('POST', '/login', {
                email: formData.email,
                password: formData.password,
            });

            // --- ON SUCCESS ---
            // Store the authentication token and user data in localStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Show a success message to the user
            Swal.fire({
                icon: 'success',
                title: 'موفقیت',
                text: response.message, // Use the success message directly from the API
                confirmButtonText: 'ادامه',
                confirmButtonColor: '#28a745',
                customClass: { popup: 'rtl-popup', content: 'rtl-content' },
            });

            // Redirect to the user panel/dashboard
            navigate("/panel");

        } catch (err) { 
            // --- ROBUST ERROR HANDLING ---
            // 'err' is the custom error object thrown by our `apiCall` function.
            // It contains 'status', 'message', and optionally 'errors'.

            if (err.status === 422 && err.errors) {
                // Case 1: Validation errors (HTTP 422) from Laravel
                // Combine all validation error messages into a single HTML string
                const allErrors = Object.values(err.errors).map(messages => messages[0]).join('<br>');
                
                Swal.fire({
                    icon: 'error',
                    title: 'خطای اعتبارسنجی',
                    html: `<div class="rtl-content">${allErrors}</div>`, // Display as HTML
                    confirmButtonText: 'متوجه شدم',
                    confirmButtonColor: '#d33',
                    customClass: { popup: 'rtl-popup' },
                });

            } else {
                // Case 2: Other errors (e.g., 401 Unauthorized, 500 Server Error, Network Error)
                // The 'err.message' will contain the specific message from the API or a generic network error message.
                Swal.fire({
                    icon: 'error',
                    title: 'خطا در ورود',
                    text: err.message, // e.g., "ایمیل یا رمز عبور اشتباه است"
                    confirmButtonText: 'متوجه شدم',
                    confirmButtonColor: '#d33',
                    customClass: { popup: 'rtl-popup', content: 'rtl-content' },
                });
            }
        } finally {
            // This block runs regardless of success or failure
            setLoading(false); // Reset the loading state of the button
        }
    };

    return (
        // The JSX for the component layout. This part remains unchanged.
        // NOTE: Add the following CSS to your main stylesheet (e.g., index.css) for proper RTL display in SweetAlert.
        /*
            .rtl-popup { direction: rtl; }
            .rtl-content { direction: rtl; text-align: right; }
        */
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
                    {/* Email Input */}
                    <InputField
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t.fields.email}
                        value={formData.email}
                        onChange={handleChange}
                        icon={<FaEnvelope />}
                    />

                    {/* Password Input */}
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

                    {/* Submit button with loading state */}
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
