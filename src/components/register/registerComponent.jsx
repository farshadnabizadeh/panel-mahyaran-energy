import React, { useState } from "react";
import {
    FaUser,
    FaIdCard,
    FaEnvelope,
    FaLock,
    FaUsers,
    FaBirthdayCake,
    FaUserTie,
} from "react-icons/fa";
import Login from "../../assets/img/Login.jpg";
import fa from "../../locales/fa.json";

const t = fa.signUpPage;

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
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert(t.alerts.passwordMismatch);
            return;
        }
        alert(t.alerts.success);
    };

    // minimalist + clean inputs, focus ring & shadow
    const InputField = ({
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
    );

    return (
        <div
            dir="rtl"
            className="min-h-screen flex flex-col-reverse md:flex-row bg-gradient-to-tr from-slate-50 to-blue-50"
        >
            {/* --- Right side form --- */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-10 py-12 sm:px-20 sm:py-16">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-3">{t.title}</h2>
                <p className="text-gray-500 mb-10 text-lg">{t.subtitle}</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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

                        {/* Nationality */}
                        <div className="sm:col-span-2">
                            <span className="block text-sm font-semibold text-gray-700 mb-2">
                                {t.fields.nationality}
                            </span>
                            <div className="flex items-center gap-8">
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
                            type="text"
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
                        <InputField
                            id="referrerUsername"
                            name="referrerUsername"
                            type="text"
                            placeholder={t.fields.referrerUsername}
                            value={formData.referrerUsername}
                            onChange={handleChange}
                            icon={<FaUsers />}
                        />
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
                            <div className="flex items-center gap-8">
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
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl 
                     shadow-md hover:from-blue-700 hover:to-indigo-700 
                     focus:ring-4 focus:ring-blue-300 transition-all duration-300"
                    >
                        {t.buttonText}
                    </button>
                </form>
            </div>

            {/* --- Left side image --- */}
            <div className="w-full md:w-1/2 h-72 md:h-screen relative">
                <img
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    src={Login}
                    alt={t.image.alt}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center md:justify-end md:pr-20 pb-16 text-right">
                    <div className="text-white drop-shadow-lg max-w-md">
                        <h1 className="text-4xl font-bold">{t.image.overlayTitle}</h1>
                        <p className="mt-3 text-lg opacity-90">{t.image.overlaySubtitle}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
