import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const AdminPanel = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('approvals');

    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [bookings, setBookings] = useState([]);

    // ❌ ACCESS CONTROL
    if (user?.role !== 'admin') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white min-h-[100vh]">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold">Access Denied</h2>
            </div>
        );
    }

    // 🔥 FETCH DATA
    useEffect(() => {
        const fetchData = async () => {

            // PROPERTIES
            const propSnap = await getDocs(collection(db, "properties"));
            const allProperties = propSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const pending = allProperties.filter(p => p.status === "pending");
            setPendingApprovals(pending);

            // BOOKINGS
            const bookSnap = await getDocs(collection(db, "bookings"));

            const bookData = bookSnap.docs.map(doc => {
                const booking = { id: doc.id, ...doc.data() };

                // 🔥 ATTACH PROPERTY TITLE
                const property = allProperties.find(p => p.id === booking.propertyId);

                return {
                    ...booking,
                    propertyTitle: property?.title || "Unknown Property"
                };
            });

            setBookings(bookData);
        };

        fetchData();
    }, []);

    // ✅ PROPERTY APPROVE
    const approveProperty = async (id) => {
        await updateDoc(doc(db, "properties", id), {
            status: "approved"
        });

        setPendingApprovals(prev => prev.filter(p => p.id !== id));
    };

    // ❌ PROPERTY REJECT
    const rejectProperty = async (id) => {
        await deleteDoc(doc(db, "properties", id));

        setPendingApprovals(prev => prev.filter(p => p.id !== id));
    };

    // ✅ BOOKING APPROVE
    const approveBooking = async (id) => {
        await updateDoc(doc(db, "bookings", id), {
            status: "confirmed"
        });

        setBookings(prev =>
            prev.map(b => b.id === id ? { ...b, status: "confirmed" } : b)
        );
    };

    // ❌ BOOKING REJECT
    const rejectBooking = async (id) => {
        await updateDoc(doc(db, "bookings", id), {
            status: "cancelled"
        });

        setBookings(prev =>
            prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b)
        );
    };

    return (
        <div className="flex flex-col min-h-full bg-slate-50 pb-8">

            {/* HEADER */}
            <div className="bg-slate-900 px-6 pt-16 pb-8 text-white">
                <h1 className="text-3xl font-bold">Admin Panel</h1>
            </div>

            <div className="px-4 mt-8">

                {/* TABS */}
                <div className="flex bg-white p-1 rounded-xl mb-6">
                    <button
                        className={`flex-1 py-2 ${activeTab === 'approvals' ? 'bg-black text-white' : ''}`}
                        onClick={() => setActiveTab('approvals')}
                    >
                        Properties
                    </button>

                    <button
                        className={`flex-1 py-2 ${activeTab === 'bookings' ? 'bg-black text-white' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        Bookings
                    </button>
                </div>

                {/* PROPERTIES */}
                {activeTab === 'approvals' && (
                    <div className="space-y-4">
                        <h2 className="font-bold">Pending Properties</h2>

                        {pendingApprovals.length > 0 ? (
                            pendingApprovals.map(item => (
                                <div key={item.id} className="bg-white p-4 rounded-xl shadow">

                                    <h3 className="font-bold">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.location}</p>

                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => approveProperty(item.id)}
                                            className="flex-1 bg-green-500 text-white p-2 rounded"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() => rejectProperty(item.id)}
                                            className="flex-1 bg-red-500 text-white p-2 rounded"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No pending properties</p>
                        )}
                    </div>
                )}

                {/* BOOKINGS */}
                {activeTab === 'bookings' && (
                    <div className="space-y-4">
                        <h2 className="font-bold">All Bookings</h2>

                        {bookings.length > 0 ? (
                            bookings.map(b => (
                                <div key={b.id} className="bg-white p-4 rounded-xl shadow">

                                    {/* ✅ NOW SHOW TITLE */}
                                    <p className="font-semibold">{b.propertyTitle}</p>

                                    <p className="text-sm text-gray-500">User: {b.userId}</p>
                                    <p className="text-sm">Date: {b.dateTime}</p>

                                    <p className={`text-sm mt-1 ${
                                        b.status === "pending"
                                            ? "text-yellow-600"
                                            : b.status === "confirmed"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}>
                                        Status: {b.status}
                                    </p>

                                    {b.status === "pending" && (
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => approveBooking(b.id)}
                                                className="flex-1 bg-green-500 text-white p-2 rounded"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() => rejectBooking(b.id)}
                                                className="flex-1 bg-red-500 text-white p-2 rounded"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No bookings found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;