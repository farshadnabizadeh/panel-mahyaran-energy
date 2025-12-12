// src/components/dashboard/supportComponent.jsx
import React, { useState, useEffect } from 'react';
import { apiCall } from '../../requests/api';
import { FaTicketAlt, FaSpinner, FaExclamationTriangle, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';

const SupportComponent = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const response = await apiCall('GET', '/user');

      const actualUser = response.user || response;
      setUserData(actualUser);
    } catch (err) {
      console.error(err);
      setFetchError(err.message || 'خطا در دریافت اطلاعات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <FaClock className="text-yellow-500" />;
      case 'closed':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaExclamationCircle className="text-orange-500" />;
      default:
        return <FaTimesCircle className="text-red-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return 'باز';
      case 'closed':
        return 'بسته';
      case 'pending':
        return 'در انتظار';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <FaSpinner className="animate-spin text-4xl text-indigo-600" />
    </div>
  );

  if (fetchError) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-red-600">
      <FaExclamationTriangle className="text-5xl mb-4" />
      <p className="text-lg">{fetchError}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        تلاش مجدد
      </button>
    </div>
  );

  if (!userData || !userData.tickets) return null;

  return (
    <div dir="rtl" className="w-full min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <FaTicketAlt className="text-indigo-600" />
            تیکت‌های پشتیبانی
          </h1>
          <p className="text-gray-600">
            لیست تمام تیکت‌های پشتیبانی شما
          </p>
        </div>

        {userData.tickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <FaTicketAlt className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">تیکتی یافت نشد</h3>
            <p className="text-gray-500">شما هنوز هیچ تیکت پشتیبانی ندارید.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {userData.tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(ticket.status)}
                    <h3 className="text-xl font-semibold text-gray-800">
                      {ticket.subject}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === 'low' ? 'کم' : ticket.priority === 'medium' ? 'متوسط' : 'بالا'}
                    </span>
                    <span className="text-sm text-gray-500">
                      #{ticket.id}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {ticket.message}
                </p>

                {ticket.response_message && (
                  <div className="bg-blue-50 border-r-4 border-blue-400 p-4 mb-4">
                    <h4 className="font-semibold text-blue-800 mb-2">پاسخ پشتیبانی:</h4>
                    <p className="text-blue-700">{ticket.response_message}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>وضعیت: {getStatusText(ticket.status)}</span>
                    <span>اولویت: {ticket.priority === 'low' ? 'کم' : ticket.priority === 'medium' ? 'متوسط' : 'بالا'}</span>
                  </div>
                  <div className="text-left">
                    <div>ایجاد شده: {new Date(ticket.created_at).toLocaleDateString('fa-IR')}</div>
                    <div>آخرین بروزرسانی: {new Date(ticket.updated_at).toLocaleDateString('fa-IR')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportComponent;