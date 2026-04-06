import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, sendOTP } = useAuth(); // ✅ only once
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        const res = await login(email, password);

        setIsLoading(false);

        if (res.success) {
            navigate('/');
        } else {
            setError("Invalid email or password");
        }
    };

    // ✅ REAL OTP FUNCTION
    const handleSendOTP = async () => {
        setError('');

        if (!phone) {
            setError("Enter phone number");
            return;
        }

        setIsLoading(true);

        const res = await sendOTP(phone);

        setIsLoading(false);

        if (res.success) {
            alert("OTP sent successfully");
        } else {
            setError(res.message);
        }
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

                {/* EMAIL LOGIN */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border p-2"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-2"
                    />

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white w-full p-2 rounded"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                </form>

                {/* PHONE LOGIN */}
                <div className="mt-6">
                    <p className="text-center text-sm text-gray-500 mb-2">OR</p>

                    <input
                        type="tel"
                        placeholder="Enter phone (+91XXXXXXXXXX)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border p-2 mb-2"
                    />

                    <button
                        onClick={handleSendOTP}
                        className="bg-green-600 text-white w-full p-2 rounded"
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send OTP"}
                    </button>
                </div>

                {/* reCAPTCHA */}
                <div id="recaptcha-container" className="mt-4"></div>

                <p className="mt-6 text-center text-sm">
                    Don’t have an account?{' '}
                    <button onClick={() => navigate('/signup')} className="text-indigo-600">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;