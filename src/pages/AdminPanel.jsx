import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Check, X, Users, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('approvals');

    // Basic mock security check
    if (user?.role !== 'admin') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white min-h-[100vh]">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
                <p className="text-center text-slate-500">You do not have administrative privileges to view this area.</p>
                <p className="text-sm mt-4 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">Hint: Login with an email containing "admin"</p>
            </div>
        );
    }

    // Mock Admin Data
    const pendingApprovals = [
        { id: 'pa1', title: 'Luxury Condominium', user: 'johndoe@email.com', date: 'Just now' },
        { id: 'pa2', title: 'Downtown Office Space', user: 'sarah.j@email.com', date: '2 hours ago' },
    ];

    const recentUsers = [
        { id: 'u1', name: 'John Doe', email: 'johndoe@email.com', joined: 'Today' },
        { id: 'u2', name: 'Sarah Jenkins', email: 'sarah.j@email.com', joined: 'Yesterday' },
    ];

    return (
        <div className="flex flex-col min-h-full bg-slate-50 pb-8">

            {/* Admin Header */}
            <div className="bg-slate-900 px-6 pt-16 pb-8 rounded-b-[2.5rem] shadow-xl text-white">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-emerald-400" />
                    <span className="text-emerald-400 font-bold tracking-wider text-sm">ADMINISTRATOR</span>
                </div>
                <h1 className="text-3xl font-bold">Control Panel</h1>
                <p className="text-slate-400 text-sm mt-1">Manage platform operations</p>
            </div>

            {/* Quick Stats */}
            <div className="px-4 -mt-6 z-10 relative">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                            <Activity className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900">124</p>
                            <p className="text-xs text-slate-500 font-medium">Active Listings</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900">$4.2K</p>
                            <p className="text-xs text-slate-500 font-medium">Revenue (MTD)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 mt-8">
                {/* Navigation Tabs */}
                <div className="flex bg-white shadow-sm p-1 rounded-xl mb-6 border border-slate-100">
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'approvals' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
                        onClick={() => setActiveTab('approvals')}
                    >
                        Approvals
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                </div>

                {/* Tab Content */}

                {/* Approvals Content */}
                {activeTab === 'approvals' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 px-1 mb-2">Pending Listings</h2>
                        {pendingApprovals.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                                        <p className="text-xs text-slate-500 mt-1">Submitted by: {item.user}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4 pt-3 border-t border-slate-50">
                                    <button className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors">
                                        <Check className="w-4 h-4" /> Approve
                                    </button>
                                    <button className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                                        <X className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Users Content */}
                {activeTab === 'users' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 px-1 mb-2">Recent Registrations</h2>
                        {recentUsers.map(user => (
                            <div key={user.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                        {user.joined}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminPanel;
