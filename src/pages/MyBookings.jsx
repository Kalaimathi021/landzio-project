import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../api/bookingService';
import { getPropertyById } from '../api/propertyService';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const MyBookings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await getUserBookings(user?.id);

                const enriched = await Promise.all(
                    data.map(async (booking) => {
                        const property = await getPropertyById(booking.propertyId);
                        return { ...booking, property };
                    })
                );

                setBookings(enriched);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchBookings();
        }
    }, [user]);

    // ✅ CANCEL BOOKING FUNCTION
    const cancelBooking = async (e, id) => {
        e.stopPropagation(); // 🔥 prevent card click navigation

        try {
            await updateDoc(doc(db, "bookings", id), {
                status: "cancelled",
            });

            // 🔥 update UI instantly
            setBookings((prev) =>
                prev.map((b) =>
                    b.id === id ? { ...b, status: "cancelled" } : b
                )
            );
        } catch (error) {
            console.error("Error cancelling booking:", error);
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    return (
        <div className="p-4 bg-slate-50 min-h-[100vh]">
            <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

            {bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map((b) => (
                        <div
                            key={b.id}
                            className="bg-white p-4 rounded-xl shadow cursor-pointer"
                            onClick={() => navigate(`/property/${b.propertyId}`)}
                        >
                            <h2 className="font-bold">
                                {b.property?.title || "Property"}
                            </h2>

                            <p className="text-sm text-gray-500">
                                {b.property?.location}
                            </p>

                            <p className="mt-2 text-indigo-600 text-sm">
                                Date: {b.dateTime}
                            </p>

                            {/* ✅ STATUS COLOR LOGIC */}
                            <p className={`text-xs font-semibold mt-1 ${
                                b.status === "pending"
                                    ? "text-yellow-600"
                                    : b.status === "confirmed"
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}>
                                Status: {b.status}
                            </p>

                            {/* ✅ CANCEL BUTTON */}
                            {b.status !== "cancelled" && (
                                <button
                                    onClick={(e) => cancelBooking(e, b.id)}
                                    className="mt-3 px-3 py-1 text-xs bg-red-500 text-white rounded"
                                >
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white p-6 rounded-xl">
                    No bookings yet
                </div>
            )}
        </div>
    );
};

export default MyBookings;