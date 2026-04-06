import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Calendar } from 'lucide-react';
import { getUserBookings } from '../api/bookingService';
import { getPropertyById, getProperties } from '../api/propertyService';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const Profile = () => {
    const { user, logout } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.name || "");

    // 🔥 FETCH BOOKINGS + PROPERTIES
    useEffect(() => {
        const fetchData = async () => {
            try {
                // BOOKINGS
                const bookingData = await getUserBookings(user?.id);
                const enriched = await Promise.all(
                    bookingData.map(async (b) => {
                        const property = await getPropertyById(b.propertyId);
                        return { ...b, property };
                    })
                );
                setBookings(enriched.slice(0, 3));

                // PROPERTIES
                const allProps = await getProperties();
                const myProps = allProps.filter(p => p.userId === user.id);
                setProperties(myProps);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchData();
        }
    }, [user]);

    // 🔥 UPDATE NAME
    const handleSaveName = async () => {
        if (!newName.trim()) return;

        try {
            await updateDoc(doc(db, "users", user.id), {
                name: newName
            });

            user.name = newName;
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">

            {/* HEADER */}
            <div className="bg-indigo-600 px-6 pt-16 pb-10 rounded-b-[2.5rem] text-white">
                <div className="flex flex-col items-center">

                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    {isEditing ? (
                        <input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="mt-4 px-3 py-1 rounded text-black"
                        />
                    ) : (
                        <h1 className="text-2xl font-bold mt-4">{user?.name}</h1>
                    )}

                    <p className="text-indigo-200 text-sm">{user?.email}</p>

                    {isEditing ? (
                        <button onClick={handleSaveName} className="mt-3 bg-white text-indigo-600 px-3 py-1 rounded">
                            Save
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="mt-3 bg-white/20 px-3 py-1 rounded">
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            <div className="px-4 mt-8 space-y-6">

                {/* 🔥 MY PROPERTIES */}
                <div>
                    <h2 className="text-lg font-bold mb-3">My Properties</h2>

                    {loading ? (
                        <p>Loading...</p>
                    ) : properties.length > 0 ? (
                        <div className="space-y-3">
                            {properties.map((p) => (
                                <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm">
                                    <h3 className="font-semibold text-sm">{p.title}</h3>
                                    <p className="text-xs text-gray-500">{p.location}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-4 rounded-xl">
                            <Home className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">No properties added</p>
                        </div>
                    )}
                </div>

                {/* 🔥 BOOKINGS */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-bold">Recent Bookings</h2>
                        <button
                            onClick={() => window.location.href = "/bookings"}
                            className="text-sm text-indigo-600"
                        >
                            View All
                        </button>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : bookings.length > 0 ? (
                        <div className="space-y-3">
                            {bookings.map((b) => (
                                <div key={b.id} className="bg-white p-4 rounded-xl shadow-sm">
                                    <h3 className="font-semibold text-sm">
                                        {b.property?.title}
                                    </h3>

                                    <div className="flex items-center mt-2 text-xs text-indigo-600">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {b.dateTime}
                                    </div>

                                    <p className="text-xs mt-1">{b.status}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-4 rounded-xl">
                            <p className="text-sm text-slate-500">No bookings yet</p>
                        </div>
                    )}
                </div>

                {/* LOGOUT */}
                <button
                    onClick={logout}
                    className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-xl"
                >
                    Sign Out
                </button>

            </div>
        </div>
    );
};

export default Profile;