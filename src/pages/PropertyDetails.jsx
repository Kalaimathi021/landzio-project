import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../api/propertyService';
import { createBooking } from '../api/bookingService';
import { formatCurrency } from '../api/mockData';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MapPin, BedDouble, Bath, Maximize, Phone, Calendar, CheckCircle } from 'lucide-react';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showBooking, setShowBooking] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // 🔥 FETCH PROPERTY FROM FIRESTORE
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const data = await getPropertyById(id);

                if (data) {
                    setProperty(data);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error("Error loading property:", error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id, navigate]);

    // 🔥 REAL BOOKING FUNCTION
    const handleBookVisit = async (e) => {
        e.preventDefault();

        if (!bookingDate) return;

        try {
            const bookingData = {
                propertyId: property.id,
                userId: user?.id || "anonymous",
                dateTime: bookingDate,
                status: "pending",
                createdAt: new Date()
            };

            await createBooking(bookingData);

            setBookingSuccess(true);

            setTimeout(() => {
                setShowBooking(false);
                setBookingSuccess(false);
            }, 3000);

        } catch (error) {
            console.error("Booking failed:", error);
            alert("Booking failed");
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (!property) {
        return <div className="p-8 text-center">Property not found</div>;
    }

    return (
        <div className="flex flex-col min-h-full bg-slate-50 relative pb-24">

            {/* Image */}
            <div className="relative h-72 w-full">
                <img
                    src={property?.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={property?.title}
                    className="w-full h-full object-cover"
                />

                <div className="absolute top-0 left-0 right-0 p-4 pt-8 bg-gradient-to-b from-black/50 to-transparent flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>

                    <div className="bg-white/90 px-3 py-1 rounded-full text-indigo-600 font-bold text-sm">
                        {property?.type || "Property"}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 bg-white -mt-6 rounded-t-3xl p-6 shadow">

                <h1 className="text-2xl font-bold mb-2">
                    {property?.title || "No Title"}
                </h1>

                <div className="flex items-center text-slate-500 mb-6">
                    <MapPin className="w-4 h-4 mr-1 text-indigo-500" />
                    {property?.location || "No Location"}
                </div>

                {/* Features */}
                <div className="flex justify-between py-4 border-y mb-6">

                    {property?.beds > 0 && (
                        <div className="text-center">
                            <BedDouble className="mx-auto mb-1 text-indigo-600" />
                            <p>{property.beds}</p>
                            <span className="text-xs">Beds</span>
                        </div>
                    )}

                    {property?.baths > 0 && (
                        <div className="text-center">
                            <Bath className="mx-auto mb-1 text-indigo-600" />
                            <p>{property.baths}</p>
                            <span className="text-xs">Baths</span>
                        </div>
                    )}

                    {property?.size && (
                        <div className="text-center">
                            <Maximize className="mx-auto mb-1 text-indigo-600" />
                            <p>{property.size}</p>
                            <span className="text-xs">Size</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h2 className="font-bold mb-2">Description</h2>
                    <p className="text-sm text-gray-600">
                        {property?.description || "No description available"}
                    </p>
                </div>

                {/* Owner */}
                <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                        <p className="font-bold">{property?.userId || "Owner"}</p>
                        <p className="text-xs text-gray-500">Property Owner</p>
                    </div>

                    <button className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <Phone className="w-5 h-5" />
                    </button>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 max-w-[480px] mx-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs">Price</p>
                        <p className="text-xl font-bold text-indigo-600">
                            {formatCurrency(property?.price || 0)}
                        </p>
                    </div>

                    <button
                        onClick={() => setShowBooking(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
                    >
                        Book Visit
                    </button>
                </div>
            </div>

            {/* Booking Modal */}
            {showBooking && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">

                        {bookingSuccess ? (
                            <div className="text-center">
                                <CheckCircle className="mx-auto text-green-500 mb-2" />
                                <p>Visit Requested!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleBookVisit}>
                                <h2 className="mb-4 font-bold">Book Visit</h2>

                                <input
                                    type="datetime-local"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    required
                                    className="w-full border p-2 mb-4"
                                />

                                <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
                                    Confirm Booking
                                </button>
                            </form>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetails;