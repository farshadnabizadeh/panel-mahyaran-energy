// src/SignUpPage.js

import React, { useState } from 'react';
// Import the icon components from react-icons
import { FaUser, FaIdCard, FaEnvelope, FaLock, FaUsers, FaBirthdayCake, FaUserTie } from 'react-icons/fa';
// Import the image from your assets
import Login from '../../assets/img/Login.jpg';

// --- NEW: Import the localization file ---
import fa from '../../locales/fa.json';

// --- NEW: Create a reference to the specific part of the translation file ---
const t = fa.signUpPage;

const SignUpPage = () => {
    // State and handlers remain exactly the same
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nationality: 'iran',
        nationalId: '',
        birthDate: '',
        fatherName: '',
        shenasnamehNumber: '',
        referrerUsername: '',
        email: '',
        gender: 'male',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            // --- UPDATED: Use the translation file for alerts ---
            alert(t.alerts.passwordMismatch);
            return;
        }
        console.log("Form Submitted:", formData);
        // --- UPDATED: Use the translation file for alerts ---
        alert(t.alerts.success);
    };

    // The reusable InputField component remains the same
    const InputField = ({ id, name, type, placeholder, value, onChange, icon, required = false }) => (
        <div className="relative">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
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
                className="w-full py-2.5 pr-10 pl-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );

    return (
        <div dir="rtl" className="w-full min-h-screen flex flex-col-reverse md:flex-row bg-gray-100">

            {/* Right Side: The Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-white">
                <div className="w-full max-w-md">
                    {/* --- UPDATED: Use translation file for title and subtitle --- */}
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">{t.title}</h2>
                    <p className="text-gray-500 text-center mb-8">{t.subtitle}</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* --- UPDATED: All placeholders now use the translation file --- */}
                            <InputField
                                id="firstName" name="firstName" type="text" placeholder={t.fields.firstName}
                                value={formData.firstName} onChange={handleChange} icon={<FaUser className="text-gray-400" />} required
                            />
                            <InputField
                                id="lastName" name="lastName" type="text" placeholder={t.fields.lastName}
                                value={formData.lastName} onChange={handleChange} icon={<FaUser className="text-gray-400" />} required
                            />
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.nationality}</label>
                                <div className="flex items-center space-x-6 space-x-reverse">
                                    <label className="flex items-center">
                                        <input type="radio" name="nationality" value="iran" checked={formData.nationality === 'iran'} onChange={handleChange} className="form-radio text-blue-600" />
                                        <span className="mr-2 text-gray-700">{t.fields.iran}</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="nationality" value="other" checked={formData.nationality === 'other'} onChange={handleChange} className="form-radio text-blue-600" />
                                        <span className="mr-2 text-gray-700">{t.fields.other}</span>
                                    </label>
                                </div>
                            </div>
                            <InputField
                                id="nationalId" name="nationalId" type="text" placeholder={t.fields.nationalId}
                                value={formData.nationalId} onChange={handleChange} icon={<FaIdCard className="text-gray-400" />} required
                            />
                            <InputField
                                id="birthDate" name="birthDate" type="text" placeholder={t.fields.birthDate}
                                value={formData.birthDate} onChange={handleChange} icon={<FaBirthdayCake className="text-gray-400" />} required
                            />
                            <InputField
                                id="fatherName" name="fatherName" type="text" placeholder={t.fields.fatherName}
                                value={formData.fatherName} onChange={handleChange} icon={<FaUserTie className="text-gray-400" />} required
                            />
                            <InputField
                                id="shenasnamehNumber" name="shenasnamehNumber" type="text" placeholder={t.fields.shenasnamehNumber}
                                value={formData.shenasnamehNumber} onChange={handleChange} icon={<FaIdCard className="text-gray-400" />} required
                            />
                            <InputField
                                id="referrerUsername" name="referrerUsername" type="text" placeholder={t.fields.referrerUsername}
                                value={formData.referrerUsername} onChange={handleChange} icon={<FaUsers className="text-gray-400" />}
                            />
                            <InputField
                                id="email" name="email" type="email" placeholder={t.fields.email}
                                value={formData.email} onChange={handleChange} icon={<FaEnvelope className="text-gray-400" />}
                            />
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t.fields.gender}</label>
                                <div className="flex items-center space-x-6 space-x-reverse">
                                    <label className="flex items-center">
                                        <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} className="form-radio text-blue-600" />
                                        <span className="mr-2 text-gray-700">{t.fields.male}</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} className="form-radio text-blue-600" />
                                        <span className="mr-2 text-gray-700">{t.fields.female}</span>
                                    </label>
                                </div>
                            </div>
                            <InputField
                                id="password" name="password" type="password" placeholder={t.fields.password}
                                value={formData.password} onChange={handleChange} icon={<FaLock className="text-gray-400" />} required
                            />
                            <InputField
                                id="confirmPassword" name="confirmPassword" type="password" placeholder={t.fields.confirmPassword}
                                value={formData.confirmPassword} onChange={handleChange} icon={<FaLock className="text-gray-400" />} required
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                            >
                                {/* --- UPDATED: Use translation file for button text --- */}
                                {t.buttonText}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Left Side: The Image */}
            <div className="w-full md:w-1/2 h-64 md:h-screen relative">
                <img
                    className="w-full h-full object-cover"
                    src={Login}
                    // --- UPDATED: Use translation file for image alt text ---
                    alt={t.image.alt}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-8">
                    <div className="text-center text-white">
                        {/* --- UPDATED: Use translation file for overlay text --- */}
                        <h1 className="text-4xl font-bold">{t.image.overlayTitle}</h1>
                        <p className="mt-4 text-lg">{t.image.overlaySubtitle}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
