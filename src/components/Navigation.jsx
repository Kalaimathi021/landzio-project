import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, PlusSquare, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const { user } = useAuth();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
            <div className="max-w-[480px] mx-auto px-6 py-3 flex justify-between items-center">

                {/* Home */}
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`
                    }
                >
                    <Home size={24} />
                    <span className="text-xs font-medium">Home</span>
                </NavLink>

                {/* 🔥 My Bookings */}
                <NavLink
                    to="/my-bookings"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`
                    }
                >
                    <Calendar size={24} />
                    <span className="text-xs font-medium">Bookings</span>
                </NavLink>

                {/* Add Property */}
                <NavLink
                    to="/add"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`
                    }
                >
                    <PlusSquare size={24} />
                    <span className="text-xs font-medium">Add</span>
                </NavLink>

                {/* Admin */}
                {user?.role === 'admin' && (
                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`
                        }
                    >
                        <Shield size={24} />
                        <span className="text-xs font-medium">Admin</span>
                    </NavLink>
                )}

                {/* Profile */}
                {user?.role !== 'admin' && (
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`
                        }
                    >
                        <User size={24} />
                        <span className="text-xs font-medium">Profile</span>
                    </NavLink>
                )}

            </div>
        </nav>
    );
};

export default Navigation;