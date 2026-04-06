import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, updateProperty } from '../api/propertyService';

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        type: 'House',
        price: '',
        size: '',
        location: '',
        beds: '',
        baths: '',
        description: '',
        image: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPropertyById(id);
            if (data) {
                setFormData(data);
            } else {
                navigate('/');
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await updateProperty(id, {
                ...formData,
                price: Number(formData.price),
                beds: Number(formData.beds) || 0,
                baths: Number(formData.baths) || 0,
            });

            alert("Updated successfully");
            navigate('/');
        } catch (error) {
            alert("Update failed");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Edit Property</h1>

            <form onSubmit={handleUpdate} className="space-y-4">

                <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full border p-2" />

                <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full border p-2" />

                <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full border p-2" />

                <input name="size" value={formData.size} onChange={handleChange} placeholder="Size" className="w-full border p-2" />

                <input name="beds" type="number" value={formData.beds} onChange={handleChange} placeholder="Beds" className="w-full border p-2" />

                <input name="baths" type="number" value={formData.baths} onChange={handleChange} placeholder="Baths" className="w-full border p-2" />

                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border p-2" />

                <button className="bg-indigo-600 text-white px-4 py-2 rounded">
                    Update Property
                </button>

            </form>
        </div>
    );
};

export default EditProperty;