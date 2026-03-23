import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, formatCurrency } from '../api/mockData';
import { ArrowLeft, MapPin, BedDouble, Bath, Maximize, Phone, Calendar, CheckCircle } from 'lucide-react';
const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [showBooking, setShowBooking] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        const data = getPropertyById(id);
        if (data) {
            setProperty(data);
        } else {
            // Handle not found
            navigate('/');
        }
    }, [id, navigate]);

    const handleBookVisit = (e) => {
        e.preventDefault();
        if (bookingDate) {
            // Mock booking logic
            setBookingSuccess(true);
            setTimeout(() => {
                setShowBooking(false);
                setBookingSuccess(false);
            }, 3000);
        }
    };

    if (!property) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="flex flex-col min-h-full bg-slate-50 relative pb-24">
            {/* Top Image & Nav */}
            <div className="relative h-72 w-full">
                <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 right-0 p-4 pt-8 bg-gradient-to-b from-black/50 to-transparent flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-indigo-600 font-bold text-sm shadow-sm">
                        {property.type}
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 bg-white -mt-6 rounded-t-3xl p-6 relative z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">

                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">{property.title}</h1>
                </div>

                <div className="flex items-center text-slate-500 mb-6">
                    <MapPin className="w-4 h-4 mr-1 text-indigo-500" />
                    <span>{property.location}</span>
                </div>

                {/* Features Row */}
                <div className="flex justify-between items-center py-4 border-y border-slate-100 mb-6 px-2">
                    {property.beds > 0 && (
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-2">
                                <BedDouble className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">{property.beds}</span>
                            <span className="text-xs text-slate-500">Beds</span>
                        </div>
                    )}

                    {property.baths > 0 && (
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-2">
                                <Bath className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">{property.baths}</span>
                            <span className="text-xs text-slate-500">Baths</span>
                        </div>
                    )}

                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-2">
                            <Maximize className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">{property.size.split(' ')[0]}</span>
                        <span className="text-xs text-slate-500">{property.size.split(' ')[1] || 'Size'}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Description</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {property.description}
                    </p>
                </div>

                {/* Agent Info */}
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <img
                            src={property.seller.avatar}
                            alt={property.seller.name}
                            className="w-12 h-12 rounded-full object-cover mr-3"
                        />
                        <div>
                            <p className="text-sm font-bold text-slate-900">{property.seller.name}</p>
                            <p className="text-xs text-slate-500">Property Agent</p>
                        </div>
                    </div>
                    <button className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <Phone className="w-5 h-5" />
                    </button>
                </div>

            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 max-w-[480px] mx-auto">
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <p className="text-xs text-slate-500 font-medium h-4">Price</p>
                        <p className="text-2xl font-bold text-indigo-600 leading-none">
                            {formatCurrency(property.price)}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowBooking(true)}
                        className="btn btn-primary flex-1 py-4"
                    >
                        Book Visit
                    </button>
                </div>
            </div>

            {/* Booking Modal Overlay */}
            {showBooking && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 max-w-[480px] mx-auto overflow-hidden">
                    <div className="bg-white w-full rounded-t-3xl sm:rounded-3xl p-6 transform transition-all">

                        {bookingSuccess ? (
                            <div className="text-center py-8">
                                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Visit Requested!</h3>
                                <p className="text-slate-500 text-sm">The agent will contact you shortly to confirm.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-slate-900">Book a Visit</h3>
                                    <button onClick={() => setShowBooking(false)} className="text-slate-400 hover:text-slate-600 p-2">✕</button>
                                </div>

                                <form onSubmit={handleBookVisit}>
                                    <div className="input-group mb-6">
                                        <label className="input-label">Select Date & Time</label>
                                        <div className="input-icon-wrapper">
                                            <Calendar className="icon w-5 h-5 left-3" />
                                            <input
                                                type="datetime-local"
                                                className="input-field pl-10"
                                                value={bookingDate}
                                                onChange={(e) => setBookingDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-full py-4">
                                        Confirm Booking
                                    </button>
                                </form>
                            </>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
};

export default PropertyDetails;
