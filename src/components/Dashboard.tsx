// Dashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const history = useNavigate();

    const handleNavigation = (path: string) => {
        history(path);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-8">Main Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer" onClick={() => handleNavigation('/invoice')}>
                    <h2 className="text-xl font-semibold">Create Invoice</h2>
                    <p className="mt-2 text-gray-600">Generate and manage invoices for your clients.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer" onClick={() => handleNavigation('/delivery-challan')}>
                    <h2 className="text-xl font-semibold">Create Delivery Challan</h2>
                    <p className="mt-2 text-gray-600">Create delivery challans for your shipments.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer" onClick={() => handleNavigation('/stock')}>
                    <h2 className="text-xl font-semibold">Manage Stock</h2>
                    <p className="mt-2 text-gray-600">View and manage your stock inventory.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;