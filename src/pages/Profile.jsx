import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Calendar, CreditCard, ChevronRight, Settings } from 'lucide-react';
import { getProperties, formatCurrency } from '../api/mockData';

const Profile = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('properties'); // properties, visits, payments

    // Mock data for the user
    const userProperties = getProperties().slice(0, 2); // Pretend user owns first 2

    const userVisits = [
        { id: 'v1', propertyTitle: 'Modern Luxury Villa', date: 'Oct 24, 2023 at 10:00 AM', status: 'Approved' },
        { id: 'v2', propertyTitle: 'Sunny Acres Farm', date: 'Oct 28, 2023 at 2:00 PM', status: 'Pending' },
    ];

    const userPayments = [
        { id: 'pay1', desc: 'Listing Fee - Modern Villa', amount: 49.99, date: 'Sep 15, 2023', status: 'Completed' },
        { id: 'pay2', desc: 'Premium Promotion', amount: 99.99, date: 'Sep 16, 2023', status: 'Completed' },
    ];

    return (
        <div className="flex flex-col min-h-full bg-slate-50 pb-8">

            {/* Profile Header */}
            <div className="bg-indigo-600 px-6 pt-16 pb-8 rounded-b-[2.5rem] shadow-md text-white">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/50 shadow-inner">
                            <span className="text-3xl font-bold">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user?.name || 'User Name'}</h1>
                            <p className="text-indigo-200 text-sm mt-1">{user?.email}</p>
                        </div>
                    </div>
                    <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="px-4 -mt-6 z-10 relative">
                <div className="bg-white rounded-2xl shadow-sm p-4 flex justify-between divide-x divide-slate-100">
                    <div className="flex-1 flex flex-col items-center">
                        <span className="text-2xl font-bold text-slate-900">{userProperties.length}</span>
                        <span className="text-xs text-slate-500 font-medium">Listings</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                        <span className="text-2xl font-bold text-slate-900">{userVisits.length}</span>
                        <span className="text-xs text-slate-500 font-medium">Visits</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                        <span className="text-xl font-bold text-emerald-600 flex items-center h-8">Active</span>
                        <span className="text-xs text-slate-500 font-medium pt-1">Status</span>
                    </div>
                </div>
            </div>

            <div className="px-4 mt-8">
                {/* Tabs */}
                <div className="flex bg-slate-200/50 p-1 rounded-xl mb-6">
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'properties' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('properties')}
                    >
                        My Properties
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'visits' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('visits')}
                    >
                        Visits
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'payments' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('payments')}
                    >
                        Payments
                    </button>
                </div>

                {/* Tab Content */}
                <div className="space-y-4">

                    {/* Properties Tab */}
                    {activeTab === 'properties' && (
                        userProperties.length > 0 ? (
                            userProperties.map(prop => (
                                <div key={prop.id} className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 items-center">
                                    <img src={prop.image} alt={prop.title} className="w-20 h-20 rounded-xl object-cover" />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{prop.title}</h3>
                                        <p className="text-indigo-600 font-medium text-sm mt-1">{formatCurrency(prop.price)}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-medium">Active</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm">You haven't listed any properties yet.</p>
                            </div>
                        )
                    )}

                    {/* Visits Tab */}
                    {activeTab === 'visits' && (
                        userVisits.length > 0 ? (
                            userVisits.map(visit => (
                                <div key={visit.id} className="bg-white p-4 rounded-2xl shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{visit.propertyTitle}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${visit.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {visit.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-slate-500 text-sm mt-3">
                                        <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                                        {visit.date}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm">No upcoming visits scheduled.</p>
                            </div>
                        )
                    )}

                    {/* Payments Tab */}
                    {activeTab === 'payments' && (
                        userPayments.length > 0 ? (
                            userPayments.map(payment => (
                                <div key={payment.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">{payment.desc}</h3>
                                            <p className="text-xs text-slate-500 mt-1">{payment.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">${payment.amount}</p>
                                        <p className="text-xs text-emerald-600 font-medium">Paid</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm">No payment history found.</p>
                            </div>
                        )
                    )}

                </div>

                {/* Separator */}
                <div className="h-px bg-slate-200 mt-8 mb-6"></div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="w-full bg-white border border-red-200 text-red-600 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>

        </div>
    );
};

export default Profile;
