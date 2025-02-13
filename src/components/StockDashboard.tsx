// StockDashboard.tsx
import { Add, Delete, Download, Edit, Inventory, Print, ReportGmailerrorred, TrendingUp } from "@mui/icons-material";
import React, { useState } from "react";
import AddItemModal from "./StockModal"; // Import the AddItemModal component

export const StockDashboard = () => {
    const [items, setItems] = useState<{ brand: string; name: string; batchNo: string; quantity: number; price: number }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<{ brand: string; name: string; batchNo: string; quantity: number; price: number } | null>(null);

    const handleAddItem = (newItem: { brand: string; name: string; batchNo: string; quantity: number; price: number }) => {
        if (itemToEdit) {
            // Update existing item
            setItems(items.map(item => item.batchNo === itemToEdit.batchNo ? newItem : item));
            setItemToEdit(null); // Reset the edit state
        } else {
            // Add new item
            setItems([...items, newItem]);
        }
    };

    const handleEditItem = (item: { brand: string; name: string; batchNo: string; quantity: number; price: number }) => {
        setItemToEdit(item);
        setIsModalOpen(true);
    };

    const handleDeleteItem = (batchNo: string) => {
        setItems(items.filter(item => item.batchNo !== batchNo));
    };

    return (
        <div id="webcrumbs" className="p-6">
            <div className="w-full h-auto bg-white rounded-xl shadow-lg p-6 min-h-screen">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Stock Management Dashboard</h1>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { color: "blue", icon: <Inventory />, label: "Total Items", value: items.length.toString() },
                        { color: "green", icon: <TrendingUp />, label: "In Stock", value: items.filter(item => item.quantity > 0).length.toString() },
                        { color: "yellow", icon: <ReportGmailerrorred />, label: "Low Stock", value: items.filter(item => item.quantity < 10).length.toString() },
                        { color: "red", icon: <Inventory />, label: "Out of Stock", value: items.filter(item => item.quantity === 0).length.toString() }
                    ].map((item, index) => (
                        <div key={index} className={`bg-${item.color}-50 p-4 rounded-xl hover:shadow-md transition-all duration-300`}>
                            {item.icon}
                            <p className="mt-2 text-sm">{item.label}</p>
                            <h2 className="text-2xl font-bold">{item.value}</h2>
                        </div>
                    ))}
                </div>

                {/* Search & Filters */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <input type="text" placeholder="Search items..." className="px-4 py-2 w-full sm:w-auto rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />

                        {/* Filter Dropdown */}
                        <details className="relative w-full sm:w-auto">
                            <summary className="px-4 py-2 w-full sm:w-auto text-center rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-100 transition-all duration-300">
                                Filter by Brand
                            </summary>
                            <div className="absolute top-full left-0 mt-2 w-full sm:w-48 bg-white rounded-lg shadow-lg p-2 z-10">
                                {["Brand A", "Brand B", "Brand C"].map((brand, idx) => (
                                    <div key={idx} className="p-2 hover:bg-gray-100 rounded cursor-pointer">{brand}</div>
                                ))}
                            </div>
                        </details>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300" onClick={() => setIsModalOpen(true)}>
                                <Download />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300">
                                <Print />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stock Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm hidden md:table">
                        <thead className="bg-gray-100">
                            <tr>
                                {["Brand", "Item Name", "Batch No.", "Quantity", "Price", "Actions"].map((header, idx) => (
                                    <th key={idx} className="px-4 py-3 text-left">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-300">
                                    <td className="px-4 py-3">{item.brand}</td>
                                    <td className="px-4 py-3">{item.name}</td>
                                    <td className="px-4 py-3">{item.batchNo}</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">{item.quantity} boxes</span>
                                    </td>
                                    <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button className="p-1 hover:bg-blue-400 rounded transition-all duration-300" onClick={() => handleEditItem(item)}>
                                                <Edit />
                                            </button>
                                            <button className="p-1 hover:bg-red-400 rounded transition-all duration-300" onClick={() => handleDeleteItem(item.batchNo)}>
                                                <Delete />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile View */}
                    <div className="md:hidden">
                        {items.map((item, index) => (
                            <div key={index} className="border-b border-gray-200 p-4 mb-4 bg-white rounded-lg shadow-md">
                                <h3 className="font-bold">{item.brand}</h3>
                                <p><strong>Item Name:</strong> {item.name}</p>
                                <p><strong>Batch No:</strong> {item.batchNo}</p>
                                <p><strong>Quantity:</strong> {item.quantity} boxes</p>
                                <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                                <div className="flex gap-2 mt-2">
                                    <button className="p-1 hover:bg-blue-400 rounded transition-all duration-300" onClick={() => handleEditItem(item)}>
                                        <Edit />
                                    </button>
                                    <button className="p-1 hover:bg-red-400 rounded transition-all duration-300" onClick={() => handleDeleteItem(item.batchNo)}>
                                        <Delete />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add New Item Button */}
                <div className="mt-4 flex justify-center sm:justify-start">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2" onClick={() => {
                        setItemToEdit(null); // Reset the edit state
                        setIsModalOpen(true);
                    }}>
                        <Add />
                        Add New Item
                    </button>
                </div>
            </div>

            {/* Add Item Modal */}
            <AddItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddItem={handleAddItem}
                itemToEdit={itemToEdit}
            />
        </div>
    );
};