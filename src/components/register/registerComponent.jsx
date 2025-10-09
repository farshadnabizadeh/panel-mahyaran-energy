// src/SignUpPage.js

import React, { useState } from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaLock, FaUsers, FaBirthdayCake, FaUserTie } from 'react-icons/fa';
import Login from '../../assets/img/Login.jpg'
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
            alert("Passwords do not match!");
            return;
        }
        console.log("Form Submitted:", formData);
        alert("ثبت نام با موفقیت انجام شد!");
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
        // CHANGE: The main container now directly manages the two-column layout
        // and ensures it takes up the full screen height.
        <div dir="rtl" className="w-full min-h-screen flex flex-col-reverse md:flex-row bg-gray-100">

            {/* Right Side: The Form */}
            {/* CHANGE: This section now takes half the width on desktop and is a flex container
                to center the form content vertically. It will also scroll if content overflows. */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-white">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">ایجاد حساب کاربری</h2>
                    <p className="text-gray-500 text-center mb-8">برای پیوستن به ما، لطفا فرم زیر را تکمیل کنید.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* All form fields are the same as before */}
                            <InputField
                                id="firstName" name="firstName" type="text" placeholder="نام"
                                value={formData.firstName} onChange={handleChange} icon={<FaUser className="text-gray-400" />} required
                            />
                            <InputField
                                id="lastName" name="lastName" type="text" placeholder="نام خانوادگی"
                                value={formData.lastName} onChange={handleChange} icon={<FaUser className="text-gray-400" />} required
                            />
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">ملیت:</label>
                                <div className="flex items-center space-x-6 space-x-reverse">
                                    <label className="flex items-center">
                                        <input type="radio" name="nationality" value="iran" checked={formData.nationality === 'iran'} onChange={handleChange} className="form-radio text-blue-600" />
                                        <span className="mr-2 text-gray-700">ایران</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="nationality" value="other" checked={formData.nationality === 'other'} onChange={handleChange} className="form-radio text-blue-600" />
                                        <span className="mr-2 text-gray-700">غیر ایران</span>
                                    </label>
                                </div>
                            </div>
                            <InputField
                                id="nationalId" name="nationalId" type="text" placeholder="کد ملی"
                                value={formData.nationalId} onChange={handleChange} icon={<FaIdCard className="text-gray-400" />} required
                            />
                            <InputField
                                id="birthDate" name="birthDate" type="text" placeholder="تاریخ تولد (مثال: 1375/05/14)"
                                value={formData.birthDate} onChange={handleChange} icon={<FaBirthdayCake className="text-gray-400" />} required
                            />
                            <InputField
                                id="fatherName" name="fatherName" type="text" placeholder="نام پدر"
                                value={formData.fatherName} onChange={handleChange} icon={<FaUserTie className="text-gray-400" />} required
                            />
                            <InputField
                                id="shenasnamehNumber" name="shenasnamehNumber" type="text" placeholder="شماره شناسنامه"
                                value={formData.shenasnamehNumber} onChange={handleChange} icon={<FaIdCard className="text-gray-400" />} required
                            />
                            <InputField
                                id="referrerUsername" name="referrerUsername" type="text" placeholder="نام کاربری معرف"
                                value={formData.referrerUsername} onChange={handleChange} icon={<FaUsers className="text-gray-400" />}
                            />
                            <InputField
                                id="email" name="email" type="email" placeholder="ایمیل (اختیاری)"
                                value={formData.email} onChange={handleChange} icon={<FaEnvelope className="text-gray-400" />}
                            />
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">جنسیت:</label>
                                <div className="flex items-center space-x-6 space-x-reverse">
                                    <label className="flex items-center">
                                        <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} className="form-radio text-blue-600" />
                                        <span className="mr-2 text-gray-700">مرد</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} className="form-radio text-blue-600" />
                                        <span className="mr-2 text-gray-700">زن</span>
                                    </label>
                                </div>
                            </div>
                            <InputField
                                id="password" name="password" type="password" placeholder="رمز عبور"
                                value={formData.password} onChange={handleChange} icon={<FaLock className="text-gray-400" />} required
                            />
                            <InputField
                                id="confirmPassword" name="confirmPassword" type="password" placeholder="تکرار رمز عبور"
                                value={formData.confirmPassword} onChange={handleChange} icon={<FaLock className="text-gray-400" />} required
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                            >
                                ثبت نام
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Left Side: The Image */}
            {/* CHANGE: This section is now designed to take up half the width and full screen height on desktop.
                On mobile, it's a shorter, fixed-height block. */}
            <div className="w-full md:w-1/2 h-64 md:h-screen relative">
                <img
                    className="w-full h-full"
                    src={Login}
                    alt="Team working together"
                />
                {/* Optional but recommended: Add an overlay to make text more readable */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-8">
                    <div className="text-center text-white">
                        <h1 className="text-4xl font-bold">به ما بپیوندید</h1>
                        <p className="mt-4 text-lg">دنیایی از فرصت‌ها در انتظار شماست.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
