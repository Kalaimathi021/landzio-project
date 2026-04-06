import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProperties, deleteProperty } from '../api/propertyService';
import { formatCurrency } from '../api/mockData';
import { Search, MapPin, Grid, Building, Home as HomeIcon, LayoutPanelLeft, Tractor, Trees } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
    { id: 'All', name: 'All', icon: Grid },
    { id: 'House', name: 'House', icon: HomeIcon },
    { id: 'Apartment', name: 'Apartment', icon: Building },
    { id: 'Store', name: 'Store', icon: LayoutPanelLeft },
    { id: 'Land', name: 'Land', icon: Trees },
    { id: 'Plot', name: 'Plot', icon: Grid },
    { id: 'Farm Land', name: 'Farm Land', icon: Tractor },
];

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeCategory, setActiveCategory] = useState('All');
    const [properties, setProperties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('all');

    // ✅ FETCH ONLY APPROVED PROPERTIES
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProperties();

                const approved = (data || []).filter(
                    (p) => p.status === "approved"
                );

                setProperties(approved);
            } catch (error) {
                console.error("Error fetching properties:", error);
                setProperties([]);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteProperty(id);
            setProperties(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            alert("Delete failed");
        }
    };

    const filteredProperties = properties.filter(p => {
        const title = p?.title || "";
        const location = p?.location || "";

        const matchesCategory =
            activeCategory === 'All' || p?.type === activeCategory;

        const matchesSearch =
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesUser = true;

        if (viewMode === "mine") {
            matchesUser =
                p?.userId && user?.id && p.userId === user.id;
        }

        return matchesCategory && matchesSearch && matchesUser;
    });

    return (
        <div className="flex flex-col min-h-full">

            {/* Header */}
            <div className="bg-indigo-600 px-6 pt-12 pb-6 rounded-b-[2rem] shadow-md text-white">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-indigo-200 text-sm font-medium">Good Morning 👋</p>
                        <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
                    </div>

                    <div
                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => navigate('/profile')}
                    >
                        <span className="text-xl font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mt-4">
                    <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-slate-900"
                        placeholder="Search address, city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 py-6 bg-slate-50">

                {/* VIEW TOGGLE */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setViewMode("all")}
                        className={`px-4 py-2 rounded-xl ${
                            viewMode === "all"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-600"
                        }`}
                    >
                        All Properties
                    </button>

                    <button
                        onClick={() => setViewMode("mine")}
                        className={`px-4 py-2 rounded-xl ${
                            viewMode === "mine"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-600"
                        }`}
                    >
                        My Properties
                    </button>
                </div>

                {/* Categories */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold mb-4">Categories</h2>

                    <div className="flex overflow-x-auto gap-3">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex flex-col items-center min-w-[80px] p-3 rounded-xl ${
                                        isActive
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-slate-500'
                                    }`}
                                >
                                    <Icon className="w-5 h-5 mb-1" />
                                    <span className="text-xs">{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Properties */}
                <div>
                    <h2 className="text-lg font-bold mb-4">Featured Properties</h2>

                    {filteredProperties.length > 0 ? (
                        <div className="space-y-4">
                            {filteredProperties.map((property) => {
                                const isOwner =
                                    property?.userId &&
                                    user?.id &&
                                    property.userId === user.id;

                                return (
                                    <div
                                        key={property.id}
                                        className="bg-white rounded-xl shadow cursor-pointer"
                                        onClick={() => navigate(`/property/${property.id}`)}
                                    >
                                        <div className="h-48 w-full">
                                            <img
                                                src={property?.image || "https://via.placeholder.com/400x300"}
                                                alt={property?.title}
                                                className="w-full h-full object-cover rounded-t-xl"
                                            />
                                        </div>

                                        <div className="p-4">
                                            <h3 className="font-bold text-lg">{property?.title}</h3>

                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {property?.location}
                                            </div>

                                            <p className="mt-2 font-semibold text-indigo-600">
                                                {formatCurrency(property?.price || 0)}
                                            </p>

                                            {isOwner && (
                                                <div className="flex gap-4 mt-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/edit/${property.id}`);
                                                        }}
                                                        className="text-blue-600 text-sm"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(property.id);
                                                        }}
                                                        className="text-red-500 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-xl">
                            <p>No properties found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;