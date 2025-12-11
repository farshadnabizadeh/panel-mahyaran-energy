import React, { useState } from "react";
import {
    FaUser,
    FaIdCard,
    FaEnvelope,
    FaLock,
    FaUsers,
    FaBirthdayCake,
    FaUserTie,
    FaBriefcase, // New icon for Employer
} from "react-icons/fa";
import Swal from 'sweetalert2';
import Login from "../../assets/img/Login.jpg";
import fa from "../../locales/fa.json";

// API function
const registerUser = async (userData) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(JSON.stringify(data.errors || { general: data.message || 'Registration failed' }));
    }

    return data;
};

const t = fa.signUpPage;

const InputField = React.memo(({
    id,
    name,
    type,
    placeholder,
    value,
    onChange,
    icon,
    required = false,
}) => (
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
            required={required}
            className="w-full py-3 pr-10 pl-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 
               focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 
               transition-all duration-200 shadow-sm focus:shadow-md"
        />
    </div>
));

InputField.displayName = "InputField";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        nationality: "iran",
        nationalId: "",
        birthDate: "",
        fatherName: "",
        shenasnamehNumber: "",
        referrerUsername: "",
        email: "",
        gender: "male",
        password: "",
        confirmPassword: "",
        employer: false, // ADDED: Default is false (Networker)
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (name === 'employer') {
            // Handle employer boolean conversion
            setFormData((prev) => ({ ...prev, [name]: value === 'true' }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'خطا',
                text: t.alerts.passwordMismatch || 'رمزهای عبور مطابقت ندارند',
                confirmButtonText: 'متوجه شدم',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        setLoading(true);

        try {
            const apiData = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                nationality: formData.nationality,
                national_id: formData.nationalId,
                birth_date: formData.birthDate,
                father_name: formData.fatherName,
                shenasnameh_number: formData.shenasnamehNumber,
                // Logic: If employer is true, send null for referrer, otherwise send value
                referrer_username: formData.employer ? null : formData.referrerUsername,
                email: formData.email,
                gender: formData.gender,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
                employer: formData.employer, // Send employer status
            };

            const response = await registerUser(apiData);

            Swal.fire({
                icon: 'success',
                title: 'موفقیت',
                text: response.message || t.alerts.success || 'کاربر با موفقیت ثبت شد ✅',
                confirmButtonText: 'ورود به حساب',
                confirmButtonColor: '#28a745',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/login';
                }
            });

        } catch (err) {
            try {
                const errorData = JSON.parse(err.message);
                if (Object.keys(errorData).length > 0 && !errorData.general) {
                    const allErrors = Object.entries(errorData)
                        .map(([field, messages]) => {
                            const fieldNames = {
                                'first_name': 'نام',
                                'last_name': 'نام خانوادگی',
                                'nationality': 'ملیت',
                                'national_id': 'کد ملی',
                                'birth_date': 'تاریخ تولد',
                                'father_name': 'نام پدر',
                                'shenasnameh_number': 'شماره شناسنامه',
                                'referrer_username': 'نام کاربری معرف',
                                'email': 'ایمیل',
                                'gender': 'جنسیت',
                                'password': 'رمز عبور',
                                'password_confirmation': 'تکرار رمز عبور',
                                'employer': 'نوع حساب'
                            };
                            const fieldName = fieldNames[field] || field.replace('_', ' ');
                            return `${fieldName}: ${messages[0]}`;
                        })
                        .join('\n\n');

                    Swal.fire({
                        icon: 'error',
                        title: '<div style="direction: rtl; text-align: right;">خطاهای ثبت نام</div>',
                        html: `<div style="direction: rtl; text-align: right; font-size: 1rem; line-height: 1.6;">${allErrors.replace(/\n\n/g, '<br><br>')}</div>`,
                        confirmButtonText: 'متوجه شدم',
                        confirmButtonColor: '#d33',
                        customClass: { popup: 'text-right', content: 'text-right' },
                        width: 500,
                        padding: '1.5em'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'خطا',
                        text: errorData.general || 'ثبت نام با خطا مواجه شد',
                        confirmButtonText: 'متوجه شدم',
                    });
                }
            } catch (parseErr) {
                Swal.fire({
                    icon: 'error',
                    title: 'خطا',
                    text: 'ثبت نام با خطا مواجه شد',
                    confirmButtonText: 'متوجه شدم',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div dir="rtl" className="h-screen overflow-hidden flex flex-col-reverse md:flex-row bg-gradient-to-tr from-slate-50 to-blue-50">
            {/* --- Right side form --- */}
            <div className="w-full overflow-y-scroll md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-16 py-10 md:py-16">
                <h2 className="text-3xl sm:text-4xl mt-[200px] font-extrabold text-gray-800 mb-3">
                    {t.title}
                </h2>
                <p className="text-gray-500 mb-8 text-base sm:text-lg">{t.subtitle}</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                        <InputField
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder={t.fields.firstName}
                            value={formData.firstName}
                            onChange={handleChange}
                            icon={<FaUser />}
                        />
                        <InputField
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder={t.fields.lastName}
                            value={formData.lastName}
                            onChange={handleChange}
                            icon={<FaUser />}
                        />

                        {/* --- ADDED: Account Type (Employer vs Networker) --- */}
                        <div className="sm:col-span-2 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <span className="block text-sm font-semibold text-gray-700 mb-3">
                                نوع حساب کاربری
                            </span>
                            <div className="flex flex-wrap items-center gap-6">
                                <label className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${!formData.employer ? 'bg-blue-50 ring-1 ring-blue-200' : ''}`}>
                                    <input
                                        type="radio"
                                        name="employer"
                                        value="false"
                                        checked={formData.employer === false}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-400"
                                    />
                                    <FaUsers className="text-blue-500" />
                                    <span className="text-gray-700 font-medium">بازاریاب / کاربر عادی</span>
                                </label>

                                <label className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${formData.employer ? 'bg-blue-50 ring-1 ring-blue-200' : ''}`}>
                                    <input
                                        type="radio"
                                        name="employer"
                                        value="true"
                                        checked={formData.employer === true}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-400"
                                    />
                                    <FaBriefcase className="text-indigo-500" />
                                    <span className="text-gray-700 font-medium">کارفرما</span>
                                </label>
                            </div>
                        </div>

                        {/* Nationality */}
                        <div className="sm:col-span-2">
                            <span className="block text-sm font-semibold text-gray-700 mb-2">
                                {t.fields.nationality}
                            </span>
                            <div className="flex flex-wrap items-center gap-6">
                                {["iran", "other"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="nationality"
                                            value={opt}
                                            checked={formData.nationality === opt}
                                            onChange={handleChange}
                                            className="text-blue-600 focus:ring-blue-400"
                                        />
                                        <span className="text-gray-700">{t.fields[opt]}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <InputField
                            id="nationalId"
                            name="nationalId"
                            type="text"
                            placeholder={t.fields.nationalId}
                            value={formData.nationalId}
                            onChange={handleChange}
                            icon={<FaIdCard />}
                        />
                        <InputField
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            placeholder={t.fields.birthDate}
                            value={formData.birthDate}
                            onChange={handleChange}
                            icon={<FaBirthdayCake />}
                        />
                        <InputField
                            id="fatherName"
                            name="fatherName"
                            type="text"
                            placeholder={t.fields.fatherName}
                            value={formData.fatherName}
                            onChange={handleChange}
                            icon={<FaUserTie />}
                        />
                        <InputField
                            id="shenasnamehNumber"
                            name="shenasnamehNumber"
                            type="text"
                            placeholder={t.fields.shenasnamehNumber}
                            value={formData.shenasnamehNumber}
                            onChange={handleChange}
                            icon={<FaIdCard />}
                        />

                        {/* --- CONDITIONAL RENDERING: Hide Referrer if Employer --- */}
                        {!formData.employer && (
                            <div className="animate-fade-in">
                                <InputField
                                    id="referrerUsername"
                                    name="referrerUsername"
                                    type="text"
                                    placeholder={t.fields.referrerUsername}
                                    value={formData.referrerUsername}
                                    onChange={handleChange}
                                    icon={<FaUsers />}
                                />
                            </div>
                        )}

                        <InputField
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t.fields.email}
                            value={formData.email}
                            onChange={handleChange}
                            icon={<FaEnvelope />}
                        />

                        {/* Gender */}
                        <div className="sm:col-span-2">
                            <span className="block text-sm font-semibold text-gray-700 mb-2">
                                {t.fields.gender}
                            </span>
                            <div className="flex flex-wrap items-center gap-6">
                                {[
                                    { value: "male", label: t.fields.male },
                                    { value: "female", label: t.fields.female },
                                ].map((g) => (
                                    <label key={g.value} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={g.value}
                                            checked={formData.gender === g.value}
                                            onChange={handleChange}
                                            className="text-blue-600 focus:ring-blue-400"
                                        />
                                        <span className="text-gray-700">{g.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <InputField
                            id="password"
                            name="password"
                            type="password"
                            placeholder={t.fields.password}
                            value={formData.password}
                            onChange={handleChange}
                            icon={<FaLock />}
                        />
                        <InputField
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder={t.fields.confirmPassword}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            icon={<FaLock />}
                        />
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
                                {/* SVG Spinner */}
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
                        <span className="text-gray-600">{t.loginPrompt || "حساب دارید؟"}</span>
                        <a
                            href="/login"
                            className="ml-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        >
                            {t.loginLink || "ورود به حساب"}
                        </a>
                    </div>
                </form>
            </div>

            {/* --- Left side image --- */}
            <div className="w-full md:w-1/2 h-64 sm:h-72 md:h-screen relative">
                <img
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    src={Login}
                    alt={t.image.alt}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center md:justify-start md:pr-16 pb-12 sm:pb-16 text-right">
                    <div className="text-white drop-shadow-lg px-4">
                        <h1 className="text-3xl sm:text-4xl font-bold">
                            {t.image.overlayTitle}
                        </h1>
                        <p className="mt-3 text-base sm:text-lg opacity-90">
                            {t.image.overlaySubtitle}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
