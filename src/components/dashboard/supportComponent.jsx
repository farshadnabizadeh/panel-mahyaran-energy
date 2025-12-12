// src/components/dashboard/supportComponent.jsx
import React, { useState, useEffect } from 'react';
import { apiCall } from '../../requests/api';
import {
  FaTicketAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaPaperPlane,
  FaPlus,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const SupportComponent = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [newTicket, setNewTicket] = useState({
    subject: '',
    priority: 'medium',
    message: ''
  });

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const response = await apiCall('GET', '/user');
      const actualUser = response.user || response;
      setUserData(actualUser);
    } catch (err) {
      console.error(err);
      setFetchError(err.message || 'Error fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.message) {
      Swal.fire({
        icon: 'warning',
        title: 'توجه',
        text: 'لطفا موضوع و متن پیام را وارد کنید.',
        confirmButtonText: 'باشه'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Example API call - Ensure your backend endpoint is correct
      await apiCall('POST', '/tickets', newTicket);

      Swal.fire({
        icon: 'success',
        title: 'موفق',
        text: 'تیکت شما با موفقیت ثبت شد.',
        timer: 2000,
        showConfirmButton: false
      });

      setNewTicket({ subject: '', priority: 'medium', message: '' });
      setShowCreateForm(false);
      fetchUserData(); // Refresh list

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'خطا',
        text: error.message || 'خطایی در ارسال تیکت رخ داد.',
        confirmButtonText: 'تلاش مجدد'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <FaClock className="text-yellow-500 text-xl" />;
      case 'closed': return <FaCheckCircle className="text-green-500 text-xl" />;
      case 'pending': return <FaExclamationCircle className="text-orange-500 text-xl" />;
      default: return <FaTimesCircle className="text-red-500 text-xl" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'open': 'باز',
      'closed': 'بسته',
      'pending': 'در انتظار پاسخ',
      'rejected': 'رد شده'
    };
    return statusMap[status] || status;
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority) => {
    const pMap = { 'low': 'کم', 'medium': 'متوسط', 'high': 'بالا' };
    return pMap[priority] || priority;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <FaSpinner className="animate-spin text-5xl text-indigo-600 mb-4" />
      <span className="text-gray-500 font-medium">در حال بارگذاری اطلاعات...</span>
    </div>
  );

  if (fetchError) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-red-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        <FaExclamationTriangle className="text-6xl mb-4 mx-auto text-red-500" />
        <h3 className="text-xl font-bold mb-2">خطا در برقراری ارتباط</h3>
        <p className="text-gray-600 mb-6">{fetchError}</p>
        <button
          onClick={fetchUserData}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-md hover:shadow-lg"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );

  if (!userData) return null;

  return (
    <div dir="rtl" className="w-full min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="p-3 bg-indigo-100 rounded-full">
              <FaTicketAlt className="text-2xl text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">پشتیبانی و تیکت‌ها</h1>
              <p className="text-gray-500 text-sm mt-1">مدیریت درخواست‌ها و ارتباط با پشتیبانی</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm ${
              showCreateForm 
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {showCreateForm ? <FaTimesCircle /> : <FaPlus />}
            {showCreateForm ? 'انصراف' : 'ثبت تیکت جدید'}
          </button>
        </div>

        {/* Create Ticket Form (Collapsible) */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showCreateForm ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white rounded-2xl shadow-md border border-indigo-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaPaperPlane className="text-indigo-500" />
              ارسال پیام جدید
            </h2>
            <form onSubmit={handleSubmitTicket} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">موضوع تیکت</label>
                  <input
                    type="text"
                    name="subject"
                    value={newTicket.subject}
                    onChange={handleInputChange}
                    placeholder="مثلا: مشکل در پرداخت..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">اولویت</label>
                  <select
                    name="priority"
                    value={newTicket.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                  >
                    <option value="low">کم</option>
                    <option value="medium">متوسط</option>
                    <option value="high">بالا</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">متن پیام</label>
                <textarea
                  name="message"
                  value={newTicket.message}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="توضیحات کامل مشکل خود را بنویسید..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none bg-gray-50 focus:bg-white resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-l from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      ارسال تیکت
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {!userData.tickets || userData.tickets.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTicketAlt className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">هنوز تیکتی ثبت نکرده‌اید</h3>
              <p className="text-gray-500 mb-6">برای ارتباط با پشتیبانی، یک تیکت جدید ایجاد کنید.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline"
              >
                ثبت اولین تیکت
              </button>
            </div>
          ) : (
            userData.tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden group">
                {/* Ticket Header */}
                <div className="p-6 border-b border-gray-50 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getStatusIcon(ticket.status)}</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {ticket.subject}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                            <FaCalendarAlt className="text-gray-400" />
                            {new Date(ticket.created_at).toLocaleDateString('fa-IR')}
                          </span>
                          <span className="bg-gray-50 px-2 py-1 rounded-md">
                             شناسه: #{ticket.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getPriorityStyle(ticket.priority)}`}>
                        {getPriorityLabel(ticket.priority)}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        ticket.status === 'open' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                        ticket.status === 'closed' ? 'bg-green-50 text-green-700 border-green-100' :
                        'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {getStatusText(ticket.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ticket Content */}
                <div className="p-6 bg-gray-50/50 space-y-4">
                  <div className="flex gap-4">
                    <div className="hidden sm:flex flex-col items-center gap-1">
                       <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                         You
                       </div>
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-xl rounded-tr-none border border-gray-100 shadow-sm relative">
                       <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                        {ticket.message}
                      </p>
                    </div>
                  </div>

                  {/* Support Response */}
                  {ticket.response_message && (
                    <div className="flex gap-4">
                      <div className="flex-1 bg-indigo-50/50 p-4 rounded-xl rounded-tl-none border border-indigo-100 relative">
                        <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-bold text-indigo-800 text-sm">پاسخ پشتیبانی</h4>
                            {ticket.updated_at && (
                                <span className="text-xs text-indigo-400">
                                    {new Date(ticket.updated_at).toLocaleDateString('fa-IR')}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                          {ticket.response_message}
                        </p>
                      </div>
                      <div className="hidden sm:flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                            <FaPaperPlane className="text-sm" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportComponent;
