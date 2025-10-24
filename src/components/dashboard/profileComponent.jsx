// src/components/ProfileComponent.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { apiCall } from '../../utils/api';
import { FaUser, FaEnvelope, FaBirthdayCake, FaFlag, FaIdCard, FaLock, FaSave, FaTimes, FaEdit, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

// --- Helper Component: InputField with Icon ---
// A reusable and enhanced input field component for our form
const InputField = React.memo(({ icon, name, label, value, onChange, error, type = "text", disabled = false }) => (
    <div className="relative">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none group-focus-within:text-indigo-600 transition-colors">
                {icon}
            </span>
            <input
                type={type}
                id={name}
                name={name}
                value={value || ''}
                onChange={onChange}
                disabled={disabled}
                className={`w-full py-2.5 pl-10 pr-4 rounded-lg bg-gray-50 border text-gray-800 transition-all duration-200
                    ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-500' : 'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'}
                    ${error ? 'border-red-400 focus:ring-red-200' : 'border-gray-300'}`
                }
            />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error[0]}</p>}
    </div>
));

// --- Main Profile Component ---
const ProfileComponent = () => {
    // --- State Management ---
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({});
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submittingProfile, setSubmittingProfile] = useState(false);
    const [submittingPassword, setSubmittingPassword] = useState(false);

    const [fetchError, setFetchError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // --- Data Fetching ---
    const fetchUserData = async () => {
        try {
            setLoading(true);
            setFetchError(null);
            const response = await apiCall('GET', '/user');
            setUserData(response);
            setFormData(response);
            localStorage.setItem('user', JSON.stringify(response));
        } catch (err) {
            setFetchError(err.message || 'خطا در دریافت اطلاعات. لطفاً دوباره وارد شوید.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Memoize the initial character for the avatar
    const userInitial = useMemo(() => {
        return userData?.first_name?.charAt(0).toUpperCase() || <FaUser />;
    }, [userData]);

    // --- Event Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // On cancel, revert form data and clear errors
            setFormData(userData);
            setValidationErrors({});
        }
        setIsEditing(!isEditing);
    };

    const showToast = (icon, title) => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({ icon, title });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSubmittingProfile(true);
        setValidationErrors({});

        const changedData = Object.keys(formData).reduce((acc, key) => {
            if (formData[key] !== userData[key]) {
                acc[key] = formData[key];
            }
            return acc;
        }, {});

        if (Object.keys(changedData).length === 0) {
            showToast('info', 'هیچ تغییری برای ذخیره وجود ندارد.');
            setSubmittingProfile(false);
            setIsEditing(false);
            return;
        }

        try {
            const response = await apiCall('PUT', '/user/profile', changedData);
            setUserData(response.user);
            setFormData(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            showToast('success', response.message);
            setIsEditing(false);
        } catch (err) {
            if (err.status === 422 && err.errors) {
                setValidationErrors(err.errors);
                showToast('error', 'لطفاً خطاهای فرم را برطرف کنید.');
            } else {
                showToast('error', err.message || 'یک خطای پیش‌بینی نشده رخ داد.');
            }
        } finally {
            setSubmittingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setSubmittingPassword(true);
        setValidationErrors({});

        try {
            const response = await apiCall('PUT', '/user/profile', passwordData);
            showToast('success', response.message);
            setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' });
        } catch (err) {
            if (err.status === 422 && err.errors) {
                setValidationErrors(err.errors);
                showToast('error', 'لطفاً خطاهای فرم را برطرف کنید.');
            } else {
                showToast('error', err.message || 'یک خطای پیش‌بینی نشده رخ داد.');
            }
        } finally {
            setSubmittingPassword(false);
        }
    };
    
    // --- Render Logic ---
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-red-600">
                <FaExclamationTriangle className="text-5xl mb-4" />
                <p className="text-lg">{fetchError}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">تلاش مجدد</button>
            </div>
        );
    }

    if (!userData) return null; // Or a "not found" message

    return (
        <div dir="rtl" className="w-full min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* --- User Header Card --- */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex items-center space-x-4 space-x-reverse">
                    <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                            {userInitial}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{`${userData.first_name || ''} ${userData.last_name || ''}`}</h1>
                        <p className="text-sm text-gray-500">{userData.email}</p>
                    </div>
                </div>

                {/* --- Personal Information Form --- */}
                <form onSubmit={handleProfileSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">اطلاعات شخصی</h3>
                        {!isEditing ? (
                            <button type="button" onClick={handleEditToggle} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <FaEdit />
                                <span>ویرایش</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button type="submit" disabled={submittingProfile} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {submittingProfile ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                    <span>{submittingProfile ? 'در حال ذخیره...' : 'ذخیره'}</span>
                                </button>
                                <button type="button" onClick={handleEditToggle} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">
                                    <FaTimes />
                                    <span>لغو</span>
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        <InputField icon={<FaUser />} name="first_name" label="نام" value={formData.first_name} onChange={handleInputChange} error={validationErrors.first_name} disabled={!isEditing} />
                        <InputField icon={<FaUser />} name="last_name" label="نام خانوادگی" value={formData.last_name} onChange={handleInputChange} error={validationErrors.last_name} disabled={!isEditing} />
                        <InputField icon={<FaEnvelope />} name="email" label="ایمیل" type="email" value={formData.email} onChange={handleInputChange} error={validationErrors.email} disabled={!isEditing} />
                        <InputField icon={<FaBirthdayCake />} name="birth_date" label="تاریخ تولد" type="date" value={formData.birth_date} onChange={handleInputChange} error={validationErrors.birth_date} disabled={!isEditing} />
                        <InputField icon={<FaFlag />} name="nationality" label="ملیت" value={formData.nationality} onChange={handleInputChange} error={validationErrors.nationality} disabled={!isEditing} />
                        <InputField icon={<FaIdCard />} name="national_id" label="کد ملی" value={formData.national_id} onChange={handleInputChange} error={validationErrors.national_id} disabled={!isEditing} />
                    </div>
                </form>

                {/* --- Change Password Form --- */}
                <form onSubmit={handlePasswordSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8">
                    <h3 className="text-xl font-semibold text-gray-800 pb-4 border-b border-gray-200 mb-6">تغییر رمز عبور</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        <InputField icon={<FaLock />} name="current_password" label="رمز عبور فعلی" type="password" value={passwordData.current_password} onChange={handlePasswordChange} error={validationErrors.current_password} />
                        <div></div> {/* Spacer for grid layout */}
                        <InputField icon={<FaLock />} name="new_password" label="رمز عبور جدید" type="password" value={passwordData.new_password} onChange={handlePasswordChange} error={validationErrors.new_password} />
                        <InputField icon={<FaLock />} name="new_password_confirmation" label="تکرار رمز عبور جدید" type="password" value={passwordData.new_password_confirmation} onChange={handlePasswordChange} error={validationErrors.new_password_confirmation} />
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button type="submit" disabled={submittingPassword} className="flex items-center gap-2 w-full sm:w-auto px-6 py-2.5 font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                            {submittingPassword ? <FaSpinner className="animate-spin" /> : <FaSave />}
                            <span>{submittingPassword ? 'در حال بررسی...' : 'تغییر رمز عبور'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileComponent;
