// AddItemModal.tsx
import React, { useState, useEffect } from 'react';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddItem: (item: { brand: string; name: string; batchNo: string; quantity: number; price: number }) => void;
    itemToEdit?: { brand: string; name: string; batchNo: string; quantity: number; price: number } | null; // Allow null
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAddItem, itemToEdit }) => {
    const [brand, setBrand] = useState('');
    const [name, setName] = useState('');
    const [batchNo, setBatchNo] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (itemToEdit) {
            setBrand(itemToEdit.brand);
            setName(itemToEdit.name);
            setBatchNo(itemToEdit.batchNo);
            setQuantity(itemToEdit.quantity);
            setPrice(itemToEdit.price);
        } else {
            setBrand('');
            setName('');
            setBatchNo('');
            setQuantity(0);
            setPrice(0);
        }
    }, [itemToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddItem({ brand, name, batchNo, quantity, price });
        onClose(); // Close the modal after adding the item
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">{itemToEdit ? 'Edit Item' : 'Add New Item'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1">Brand</label>
                        <input
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="border rounded w-full px-2 py-1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Item Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border rounded w-full px-2 py-1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Batch No.</label>
                        <input
                            type="text"
                            value={batchNo}
                            onChange={(e) => setBatchNo(e.target.value)}
                            className="border rounded w-full px-2 py-1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Quantity</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="border rounded w-full px-2 py-1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="border rounded w-full px-2 py-1"
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{itemToEdit ? 'Update Item' : 'Add Item'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;