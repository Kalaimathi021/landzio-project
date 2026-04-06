import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmationResult, setConfirmationResult] = useState(null);

    // 🔥 AUTO LOGIN
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userRef = doc(db, "users", currentUser.uid);
                const snap = await getDoc(userRef);

                if (snap.exists()) {
                    setUser({ id: currentUser.uid, ...snap.data() });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // ✅ SIGNUP
    const signup = async (name, email, password) => {
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            const userData = {
                name,
                email,
                role: email === "admin@gmail.com" ? "admin" : "user",
                createdAt: new Date()
            };

            await setDoc(doc(db, "users", res.user.uid), userData);

            setUser({ id: res.user.uid, ...userData });

            return { success: true };

        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // ✅ LOGIN
    const login = async (email, password) => {
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);

            const userRef = doc(db, "users", res.user.uid);
            const snap = await getDoc(userRef);

            if (snap.exists()) {
                setUser({ id: res.user.uid, ...snap.data() });
            }

            return { success: true };

        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // 🚀 SEND OTP (FIXED)
    const sendOTP = async (phone) => {
    try {
        // 🔥 Create recaptcha only once
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth, // ✅ IMPORTANT CHANGE (auth FIRST)
                'recaptcha-container',
                {
                    size: 'invisible',
                }
            );
        }

        const appVerifier = window.recaptchaVerifier;

        const result = await signInWithPhoneNumber(auth, phone, appVerifier);
        setConfirmationResult(result);

        return { success: true };

    } catch (error) {
        console.log(error); // 👈 helps debug if needed
        return { success: false, message: error.message };
    }
};

    // 🚀 VERIFY OTP
    const verifyOTP = async (otp) => {
        try {
            const res = await confirmationResult.confirm(otp);

            const userRef = doc(db, "users", res.user.uid);
            const snap = await getDoc(userRef);

            if (!snap.exists()) {
                const userData = {
                    phone: res.user.phoneNumber,
                    role: "user",
                    createdAt: new Date()
                };

                await setDoc(userRef, userData);
                setUser({ id: res.user.uid, ...userData });
            } else {
                setUser({ id: res.user.uid, ...snap.data() });
            }

            return { success: true };

        } catch (error) {
            return { success: false, message: "Invalid OTP" };
        }
    };

    // ✅ LOGOUT
    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    const value = {
        user,
        signup,
        login,
        logout,
        sendOTP,
        verifyOTP,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};