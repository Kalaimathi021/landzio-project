import { addProperty } from '../api/propertyService';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Grid, DollarSign, Home, BedDouble, Bath, Save } from 'lucide-react';

const AddProperty = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        type: 'House',
        price: '',
        size: '',
        location: '',
        beds: '',
        baths: '',
        description: '',
        imageUrl: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const propertyData = {
                ...formData,
                price: Number(formData.price),
                beds: Number(formData.beds) || 0,
                baths: Number(formData.baths) || 0,
                image: formData.imageUrl || "https://via.placeholder.com/400x300?text=No+Image",
                createdAt: new Date()
            };

            await addProperty(propertyData);

            setIsSubmitting(false);
            setSuccess(true);

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error("❌ ERROR:", error);
            setIsSubmitting(false);
            alert(error.message);
        }
    };

    if (success) {
        return (
            <div className="flex-1 flex flex-col justify-center items-center p-6 bg-white min-h-[100vh]">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <Save className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Published!</h2>
                <p className="text-slate-500 text-center">Your property listing is now live.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-full bg-slate-50 pb-8">
            <div className="bg-white px-6 py-6 pt-12 rounded-b-[2rem] shadow-sm mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Add Property</h1>
                <p className="text-slate-500 text-sm mt-1">List a new property</p>
            </div>

            <div className="px-4">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 shadow-sm space-y-6">

                    <div className="space-y-4">
                        <div className="input-group">
                            <label>Property Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label>Type</label>
                                <select name="type" value={formData.type} onChange={handleChange}>
                                    <option>House</option>
                                    <option>Apartment</option>
                                    <option>Store</option>
                                    <option>Land</option>
                                    <option>Plot</option>
                                    <option>Farm Land</option>
                                </select>
                            </div>

                            <div>
                                <label>Price</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                            </div>
                        </div>

                        <div>
                            <label>Image URL</label>
                            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                        </div>

                        <div>
                            <label>Size</label>
                            <input type="text" name="size" value={formData.size} onChange={handleChange} required />
                        </div>

                        {['House', 'Apartment'].includes(formData.type) && (
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" name="beds" placeholder="Beds" value={formData.beds} onChange={handleChange} />
                                <input type="number" name="baths" placeholder="Baths" value={formData.baths} onChange={handleChange} />
                            </div>
                        )}

                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Publishing...' : 'Publish Property'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddProperty;