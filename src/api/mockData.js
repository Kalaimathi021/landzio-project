// Mock properties data
export const properties = [
    {
        id: 'p1',
        title: 'Modern Luxury Villa',
        type: 'House',
        price: 1250000,
        size: '3,200 sqft',
        location: 'Beverly Hills, CA',
        image: 'https://images.unsplash.com/photo-1613490908578-f222409f8745?auto=format&fit=crop&w=800&q=80',
        beds: 4,
        baths: 3,
        seller: {
            id: 'mock_agent_1',
            name: 'Sarah Jenkins',
            phone: '+1 (555) 123-4567',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
        },
        description: 'A stunning modern villa featuring open-concept living, panoramic city views, an infinity pool, and state-of-the-art smart home integration. Perfect for entertaining.'
    },
    {
        id: 'p2',
        title: 'Downtown Penthouse loft',
        type: 'Apartment',
        price: 850000,
        size: '1,800 sqft',
        location: 'Downtown Seattle, WA',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        beds: 2,
        baths: 2,
        seller: {
            id: 'mock_agent_2',
            name: 'Michael Chen',
            phone: '+1 (555) 987-6543',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
        },
        description: 'Industrial-chic penthouse loft with 20-foot ceilings, exposed brick, chef\'s kitchen, and a private rooftop terrace.'
    },
    {
        id: 'p3',
        title: 'Prime Retail Corner Store',
        type: 'Store',
        price: 450000,
        size: '1,200 sqft',
        location: 'Austin, TX',
        image: 'https://images.unsplash.com/photo-1555529733-0e670560f8e1?auto=format&fit=crop&w=800&q=80',
        beds: 0,
        baths: 1,
        seller: {
            id: 'mock_agent_1',
            name: 'Sarah Jenkins',
            phone: '+1 (555) 123-4567',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
        },
        description: 'High foot-traffic retail space in a rapidly growing neighborhood. Includes newly renovated display windows and rear storage/office area.'
    },
    {
        id: 'p4',
        title: 'Sunny Acres Farm',
        type: 'Farm Land',
        price: 620000,
        size: '45 Acres',
        location: 'Lancaster, PA',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        beds: 0,
        baths: 0,
        seller: {
            id: 'mock_agent_3',
            name: 'Robert Hayes',
            phone: '+1 (555) 456-7890',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
        },
        description: 'Beautiful rolling farmlands perfect for agricultural operations or a private estate. Includes a large outbuilding and is fully fenced.'
    },
    {
        id: 'p5',
        title: 'Suburban Development Plot',
        type: 'Plot',
        price: 150000,
        size: '0.5 Acres',
        location: 'Denver, CO',
        image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80',
        beds: 0,
        baths: 0,
        seller: {
            id: 'mock_agent_2',
            name: 'Michael Chen',
            phone: '+1 (555) 987-6543',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
        },
        description: 'Ready-to-build residential, zoned plot in a highly rated school district. Utilities already available at the street.'
    }
];

export const getProperties = () => properties;
export const getPropertyById = (id) => properties.find(p => p.id === id);

// Formatting Utilities
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(amount);
};
