import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for mock session on load
        const storedUser = localStorage.getItem('landzio_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Mock login logic
        if (email && password) {
            const mockUser = {
                id: 'user_123',
                name: email.split('@')[0],
                email: email,
                role: email.includes('admin') ? 'admin' : 'user'
            };
            setUser(mockUser);
            localStorage.setItem('landzio_user', JSON.stringify(mockUser));
            return true;
        }
        return false;
    };

    const signup = (name, email, password) => {
        // Mock signup logic
        if (name && email && password) {
            const mockUser = {
                id: `user_${Math.floor(Math.random() * 10000)}`,
                name: name,
                email: email,
                role: 'user'
            };
            setUser(mockUser);
            localStorage.setItem('landzio_user', JSON.stringify(mockUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('landzio_user');
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
