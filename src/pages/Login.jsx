import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const success = login(email, password);
            setIsLoading(false);

            if (success) {
                navigate('/');
            } else {
                setError('Invalid email or password');
            }
        }, 1000);
    };

    return (
        <div className="flex-1 flex flex-col justify-center px-6 py-12 bg-white min-h-[100vh]">
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
                    <Home className="text-white w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Landzio</h1>
                <p className="text-slate-500 mt-2 text-center">Your gateway to perfect properties</p>
            </div>

            <div className="bg-white rounded-2xl">
                <h2 className="text-xl font-bold mb-6 text-slate-800">Welcome Back</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div className="input-icon-wrapper">
                            <Mail className="icon w-5 h-5 left-3" />
                            <input
                                type="email"
                                className="input-field pl-10"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="flex justify-between items-center mb-2">
                            <label className="input-label mb-0">Password</label>
                            <a href="#" className="text-xs text-indigo-600 font-medium hover:text-indigo-700">Forgot Password?</a>
                        </div>
                        <div className="input-icon-wrapper">
                            <Lock className="icon w-5 h-5 left-3" />
                            <input
                                type="password"
                                className="input-field pl-10"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-6 py-3.5 flex justify-center items-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                <span>Sign In</span>
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <button onClick={() => navigate('/signup')} className="text-indigo-600 font-semibold hover:text-indigo-700">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
