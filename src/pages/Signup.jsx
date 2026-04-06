import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        const res = await signup(name, email, password);

        setIsLoading(false);

        if (res.success) {
            navigate('/');
        } else {
            setError(res.message || "Signup failed");
        }
    };

    return (
        <div className="flex-1 flex flex-col justify-center px-6 py-12 bg-white min-h-[100vh]">
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                    <Home className="text-white w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold">Landzio</h1>
            </div>

            <div className="bg-white">
                <h2 className="text-xl font-bold mb-6">Create Account</h2>

                {error && (
                    <div className="bg-red-100 text-red-600 p-2 mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2"
                    />

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
                        {isLoading ? "Creating..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm">
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login')} className="text-indigo-600">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;