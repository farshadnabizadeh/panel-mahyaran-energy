import React, { useState, useEffect } from 'react';
import { apiCall } from '../../utils/api';

const NetworkComponent = () => {
    const [networkData, setNetworkData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNetworkData();
    }, []);

    const fetchNetworkData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get current user from localStorage
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                throw new Error('کاربر یافت نشد');
            }
            
            const currentUser = JSON.parse(storedUser);
            
            // Fetch network data from API
            // For now, we'll use mock data (replace with actual API call)
            const mockData = {
                id: currentUser.id,
                first_name: currentUser.first_name,
                last_name: currentUser.last_name,
                email: currentUser.email,
                position: "مدیر ارشد",
                children: [
                    {
                        id: 2,
                        first_name: "پاتریشیا کنوا",
                        last_name: "",
                        email: "patricia@example.com",
                        position: "SR",
                        children: [
                            {
                                id: 4,
                                first_name: "پاسکال کارتین",
                                last_name: "",
                                email: "pascal@example.com",
                                position: "Project Trainee",
                                children: []
                            },
                            {
                                id: 5,
                                first_name: "لیو وانگ",
                                last_name: "",
                                email: "liu@example.com",
                                position: "Senior S/w Engg",
                                children: [
                                    {
                                        id: 7,
                                        first_name: "هلواتیس ناگی",
                                        last_name: "",
                                        email: "helvetis@example.com",
                                        position: "Project Trainee",
                                        children: []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 3,
                        first_name: "هِلن ماری",
                        last_name: "",
                        email: "helen@example.com",
                        position: "Project Trainee",
                        children: [
                            {
                                id: 6,
                                first_name: "خوزه فاواروتی",
                                last_name: "",
                                email: "jose@example.com",
                                position: "S/w Engg",
                                children: [
                                    {
                                        id: 8,
                                        first_name: "هورست کلوس",
                                        last_name: "",
                                        email: "horst@example.com",
                                        position: "Project Trainee",
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            setNetworkData(mockData);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Render a single node in the organization chart
    const renderNode = (node, isRoot = false) => {
        return (
            <div key={node.id} className="org-node">
                <div className={`node-content ${isRoot ? 'root-node' : ''}`}>
                    <div className="avatar">
                        <span className="avatar-initial">
                            {node.first_name?.charAt(0)}{node.last_name?.charAt(0)}
                        </span>
                    </div>
                    <div className="node-info">
                        <div className="name">{node.first_name} {node.last_name}</div>
                        <div className="position">{node.position}</div>
                    </div>
                </div>
                
                {node.children && node.children.length > 0 && (
                    <div className="children-container">
                        <div className="children-line"></div>
                        <div className="children-row">
                            {node.children.map(child => renderNode(child))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">در حال بارگذاری شبکه...</p>
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
                        onClick={fetchNetworkData}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        تلاش مجدد
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
                    <h1 className="text-3xl font-bold text-gray-900">شبکه سازمانی</h1>
                    <p className="mt-1 text-gray-600">ساختار سازمانی شبکه شما</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">ساختار سازمانی</h2>
                        <p className="text-gray-600">نمایش هرمی ساختار سازمانی با تمام سطوح زیرمجموعه</p>
                    </div>

                    {/* Organization Chart */}
                    <div className="org-chart-container">
                        {networkData && renderNode(networkData, true)}
                    </div>

                    {/* Legend */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">راهنمای رنگ‌ها</h3>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                                <span className="text-sm text-gray-700">مدیر ارشد</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-500 rounded"></div>
                                <span className="text-sm text-gray-700">SR</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                                <span className="text-sm text-gray-700">S/w Engg</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-purple-500 rounded"></div>
                                <span className="text-sm text-gray-700">Project Trainee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NetworkComponent;