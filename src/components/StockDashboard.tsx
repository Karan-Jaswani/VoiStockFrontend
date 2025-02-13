import { Add, Delete, Edit, Inventory, ReportGmailerrorred, TrendingUp } from "@mui/icons-material";
import axios from "axios"; // Import axios
import React, { useEffect, useState } from "react";
import AddItemModal from "./StockModal"; // Import the AddItemModal component
import { useAuth } from "../context/AuthContext";

export const StockDashboard = () => {
    const { userId } = useAuth();
    const [items, setItems] = useState<{ id?: number; brandName: string; itemName: string; batchNo: string; quantity: number; price: number}[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<{ id?: number; brandName: string; itemName: string; batchNo: string; quantity: number; price: number } | null>(null);


    // ✅ Fetch stock data when page loads
    useEffect(() => {
        axios.get(`http://localhost:8080/api/stocks/${userId}`)  // Adjust the URL as per your backend
            .then(response => {
                setItems(response.data);
            })
            .catch(error => console.error("Error fetching stock data:", error));
    }, [userId]);

    // ✅ Add or Update Stock Item
    const handleAddItem = async (newItem: { id?: number; brandName: string; itemName: string; batchNo: string; quantity: number; price: number }) => {
        try {
            if (itemToEdit) {
                // If item exists, update it
                await axios.put(`http://localhost:8080/api/stocks/${itemToEdit.id}`, newItem);
                setItems(items.map(item => (item.id === itemToEdit.id ? newItem : item)));
                setItemToEdit(null);
            } else {
                // If new item, save to DB
                const response = await axios.post(`http://localhost:8080/api/stocks/${userId}`, newItem);
                setItems([...items, response.data]); // Update state with saved item
            }
        } catch (error) {
            console.error("Error adding/updating item:", error);
        }
    };

    // ✅ Edit Item
    const handleEditItem = (item: { id?: number; brandName: string; itemName: string; batchNo: string; quantity: number; price: number }) => {
        setItemToEdit(item);
        setIsModalOpen(true);
    };

    // ✅ Delete Item
    const handleDeleteItem = async (id: number | undefined) => {
        if (!id) return;
        try {
            await axios.delete(`http://localhost:8080/api/stocks/${id}`);
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <div id="webcrumbs" className="p-4 sm:p-6">
            <div className="w-full h-auto bg-white rounded-xl shadow-lg p-4 sm:p-6 min-h-screen">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                    <h1 className="text-xl sm:text-2xl font-bold">Stock Management Dashboard</h1>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {[
                        { color: "blue", icon: <Inventory />, label: "Total Items", value: items.length.toString() },
                        { color: "green", icon: <TrendingUp />, label: "In Stock", value: items.filter(item => item.quantity > 0).length.toString() },
                        { color: "yellow", icon: <ReportGmailerrorred />, label: "Low Stock", value: items.filter(item => item.quantity < 10).length.toString() },
                        { color: "red", icon: <Inventory />, label: "Out of Stock", value: items.filter(item => item.quantity === 0).length.toString() }
                    ].map((item, index) => (
                        <div key={index} className={`bg-${item.color}-50 p-4 rounded-xl hover:shadow-md transition-all duration-300`}>
                            {item.icon}
                            <p className="mt-2 text-sm">{item.label}</p>
                            <h2 className="text-lg sm:text-2xl font-bold">{item.value}</h2>
                        </div>
                    ))}
                </div>

                {/* Stock Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm hidden md:table">
                        <thead className="bg-gray-100">
                            <tr>
                                {["Brand", "Item Name", "Batch No.", "Quantity", "Price", "Actions"].map((header, idx) => (
                                    <th key={idx} className="px-2 py-3 text-left">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-300">
                                    <td className="px-2 py-3">{item.brandName}</td>
                                    <td className="px-2 py-3">{item.itemName}</td>
                                    <td className="px-2 py-3">{item.batchNo}</td>
                                    <td className="px-2 py-3">{item.quantity} boxes</td>
                                    <td className="px-2 py-3">₹{item.price.toFixed(2)}</td>
                                    <td className="px-2 py-3">
                                        <div className="flex gap-2">
                                            <button className="p-1 hover:bg-blue-400 rounded transition-all duration-300" onClick={() => handleEditItem(item)}>
                                                <Edit />
                                            </button>
                                            <button className="p-1 hover:bg-red-400 rounded transition-all duration-300" onClick={() => handleDeleteItem(item.id)}>
                                                <Delete />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Card View */}
                    <div className="block md:hidden">
                        {items.map((item, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 shadow-md">
                                <h2 className="font-bold">{item.brandName} - {item.itemName}</h2>
                                <p>Batch No: {item.batchNo}</p>
                                <p>Quantity: {item.quantity} boxes</p>
                                <p>Price: ₹{item.price.toFixed(2)}</p>
                                <div className="flex gap-2">
                                    <button className="p-1 hover:bg-blue-400 rounded transition-all duration-300" onClick={() => handleEditItem(item)}>
                                        <Edit />
                                    </button>
                                    <button className="p-1 hover:bg-red-400 rounded transition-all duration-300" onClick={() => handleDeleteItem(item.id)}>
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
