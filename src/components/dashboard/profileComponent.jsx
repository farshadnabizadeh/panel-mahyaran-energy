import React, { useState, useEffect } from 'react';
import { apiCall } from '../../utils/api';

const ProfileComponent = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get user data from localStorage (the user data stored during login)
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUserData(JSON.parse(storedUser));
            }
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">در حال بارگذاری اطلاعات...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-6 bg-red-100 border border-red-400 rounded-lg max-w-md">
                    <h3 className="text-red-700 font-bold mb-2">خطا</h3>
                    <p className="text-red-600">{error}</p>
                    <button 
                        onClick={fetchUserData}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        تلاش مجدد
                    </button>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-6 bg-yellow-100 border border-yellow-400 rounded-lg">
                    <p className="text-yellow-700">اطلاعات کاربری یافت نشد</p>
                    <button 
                        onClick={fetchUserData}
                        className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                    >
                        بارگذاری مجدد
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">پروفایل کاربر</h1>
                    <p className="mt-1 text-gray-600">اطلاعات شخصی و حساب کاربری شما</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl font-bold text-blue-600">
                                        {userData.first_name?.charAt(0)}{userData.last_name?.charAt(0)}
                                    </span>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {userData.first_name} {userData.last_name}
                                </h2>
                                <p className="text-gray-600">{userData.email}</p>
                                <div className="mt-4 flex justify-center space-x-2 space-x-reverse">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {userData.nationality === 'iran' ? 'ایرانی' : userData.nationality}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {userData.gender === 'male' ? 'مرد' : 
                                         userData.gender === 'female' ? 'زن' : 
                                         userData.gender}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">عملیات سریع</h3>
                            <div className="space-y-3">
                                <button className="w-full text-right text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors">
                                    ویرایش پروفایل
                                </button>
                                <button className="w-full text-right text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors">
                                    تغییر رمز عبور
                                </button>
                                <button className="w-full text-right text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors">
                                    تنظیمات امنیتی
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">اطلاعات شخصی</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Info */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 border-b pb-2">اطلاعات پایه</h4>
                                    
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-600">نام:</span>
                                        <span className="text-gray-900">{userData.first_name || 'ندارد'}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-600">نام خانوادگی:</span>
                                        <span className="text-gray-900">{userData.last_name || 'ندارد'}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-600">ایمیل:</span>
                                        <span className="text-gray-900">{userData.email || 'ندارد'}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-600">ملیت:</span>
                                        <span className="text-gray-900">{userData.nationality || 'ندارد'}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-600">جنسیت:</span>
                                        <span className="text-gray-900">
                                            {userData.gender === 'male' ? 'مرد' : 
                                             userData.gender === 'female' ? 'زن' : 
                                             userData.gender || 'ندارد'}
                                        </span>
                                    </div>
                                </div>

                                {/* Additional Info - Only show if they have values */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 border-b pb-2">اطلاعات تکمیلی</h4>
                                    
                                    {userData.national_id && (
                                        <div className="flex justify-between py-2">
                                            <span className="font-medium text-gray-600">کد ملی:</span>
                                            <span className="text-gray-900">{userData.national_id}</span>
                                        </div>
                                    )}
                                    
                                    {userData.birth_date && (
                                        <div className="flex justify-between py-2">
                                            <span className="font-medium text-gray-600">تاریخ تولد:</span>
                                            <span className="text-gray-900">{userData.birth_date}</span>
                                        </div>
                                    )}
                                    
                                    {userData.father_name && (
                                        <div className="flex justify-between py-2">
                                            <span className="font-medium text-gray-600">نام پدر:</span>
                                            <span className="text-gray-900">{userData.father_name}</span>
                                        </div>
                                    )}
                                    
                                    {userData.shenasnameh_number && (
                                        <div className="flex justify-between py-2">
                                            <span className="font-medium text-gray-600">شماره شناسنامه:</span>
                                            <span className="text-gray-900">{userData.shenasnameh_number}</span>
                                        </div>
                                    )}
                                    
                                    {userData.referrer_username && (
                                        <div className="flex justify-between py-2">
                                            <span className="font-medium text-gray-600">معرف:</span>
                                            <span className="text-gray-900">{userData.referrer_username}</span>
                                        </div>
                                    )}
                                    
                                    {/* Show "No additional info" if none of the optional fields exist */}
                                    {!userData.national_id && 
                                     !userData.birth_date && 
                                     !userData.father_name && 
                                     !userData.shenasnameh_number && 
                                     !userData.referrer_username && (
                                        <div className="text-center py-4 text-gray-500 italic">
                                            اطلاعات اضافی موجود نیست
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
                                <button 
                                    onClick={fetchUserData}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    تازه‌سازی
                                </button>
                                <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                                    ویرایش اطلاعات
                                </button>
                            </div>
                        </div>

                        {/* Additional Sections */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Account Security */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">امنیت حساب</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">رمز عبور</span>
                                        <span className="text-green-600 text-sm">به‌روز</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">احراز هویت دو مرحله‌ای</span>
                                        <span className="text-red-600 text-sm">غیرفعال</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">فعالیت‌های اخیر</h3>
                                <div className="space-y-3">
                                    <div className="text-sm text-gray-600">
                                        آخرین ورود: امروز در 14:30
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        آخرین تغییر اطلاعات: 2 روز پیش
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileComponent;