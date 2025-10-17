import axios from "axios";
import React, { useEffect, useState } from "react";


interface CompanyDetails {
    companyName: string;
    address1: string;
    address2: string;
    gstin: string;
    companyPhone: string;
    pan: string;
    bankName: string;
    ifscCode: string;
    accountNo: string;
    upiId: string;
}

// Define interfaces for the form data
interface Item {
    id: number;
    itemName: string;
    quantity: number; // Available quantity
}

interface SelectedItem {
    id: number;
    itemName: string;
    quantity: number; // Quantity to add
}

interface FormData {
    userId: number;
    challanNo: string;
    date: string;
    clientName: string;
    clientMobile: string;
    clientAddress: string;
    clientGstin: string;
    clientState: string;
    items: SelectedItem[];
    signature: string;
}

const DeliveryChallan: React.FC = () => {
    const userId = Number(sessionStorage.getItem("userId"));
    const [formData, setFormData] = useState<FormData>({
        userId: userId || 0,
        challanNo: "",
        date: "",
        clientName: "",
        clientMobile: "",
        clientAddress: "",
        clientGstin: "",
        clientState: "",
        items: [],
        signature: "",
    });

    const [availableItems, setAvailableItems] = useState<Item[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
    const API_URL = import.meta.env.VITE_VOISTOCK_API_URL || '';
    const updatedAvailableItems = [...availableItems];

    useEffect(() => {
        const fetchItems = async () => {
            try {

                // Fetch user data based on userId
                const companyResponse = await axios.get(`${API_URL}/api/auth/user/${userId}`);

                if (companyResponse.data) {
                    // Map response data to state
                    setCompanyDetails({
                        companyName: companyResponse.data.companyName,
                        address1: companyResponse.data.address1,
                        address2: companyResponse.data.address2,
                        gstin: companyResponse.data.gstin,
                        companyPhone: companyResponse.data.companyPhone,
                        pan: companyResponse.data.pan,
                        bankName: companyResponse.data.bankName,
                        ifscCode: companyResponse.data.ifscCode,
                        accountNo: companyResponse.data.accountNo,
                        upiId: companyResponse.data.upiId,
                    })
                }

                const response = await axios.get(`${API_URL}/api/stocks/${userId}`);
                setAvailableItems(response.data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, [userId, API_URL]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const addItem = () => {
        if (selectedItemId === null) return;

        const selectedItemIndex = availableItems.findIndex(item => item.id === selectedItemId);
        const selectedItem = availableItems[selectedItemIndex];

        if (selectedItem) {
            if (quantity > selectedItem.quantity) {
                alert(`Cannot add more than available quantity (${selectedItem.quantity})`);
                return;
            }

            if (quantity < 1) {
                alert(`Please Add Atleast 1 Quantity.`);
                return;
            }

            const newItem: SelectedItem = {
                id: selectedItem.id,
                itemName: selectedItem.itemName,
                quantity: quantity,
            };

            setFormData(prevData => ({
                ...prevData,
                items: [...prevData.items, newItem],
            }));

            // Deduct the quantity from the available items
            updatedAvailableItems[selectedItemIndex].quantity -= quantity;

            setAvailableItems(updatedAvailableItems);

            // Reset selected item and quantity
            setSelectedItemId(null);
            setQuantity(1);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const deliveryChallanData = {
            userId: formData.userId,
            challanNo: formData.challanNo,
            date: formData.date,
            clientName: formData.clientName,
            clientMobile: formData.clientMobile,
            clientAddress: formData.clientAddress,
            clientGstin: formData.clientGstin,
            clientState: formData.clientState,
            itemName: formData.items.map(item => item.itemName),
            itemQuantity: formData.items.map(item => item.quantity),
            signature: formData.signature
        };

        if (deliveryChallanData.itemName.length < 1) {
            alert("Please Add Atleast 1 Item.");
            setSubmitted(false);
            return;
        } else {
            setSubmitted(true);
        }

        try {
            await axios.post(`${API_URL}/api/dchallan`, {
                dchallan: deliveryChallanData,
                stockUpdates: updatedAvailableItems,
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error('Error submitting Delivery Challan:', error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="w-full p-4 sm:p-8 bg-white rounded-lg shadow-lg mx-auto">
            {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="text-left mb-4 sm:mb-0">
                            <h1 className="text-xl sm:text-2xl font-bold mb-2">{companyDetails?.companyName}</h1>
                            <p className="text-sm">{companyDetails?.address1}</p>
                            <p className="text-sm">{companyDetails?.address2}</p>
                            <p className="text-sm">GSTIN: {companyDetails?.gstin}</p>
                            <p className="text-sm">Mobile: {companyDetails?.companyPhone}</p>
                            <p className="text-sm">PAN: {companyDetails?.pan}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-semibold mb-4 hover:text-blue-600 transition-colors duration-300">Delivery Challan</h2>
                            <div className="flex flex-col sm:flex-row justify-end gap-4">
                                <div>
                                    <input
                                        name="challanNo"
                                        type="text"
                                        value={formData.challanNo}
                                        onChange={handleChange}
                                        placeholder="Challan No."
                                        className="text-sm mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                    <input
                                        name="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="text-sm p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <h3 className="font-semibold mb-2">BILL TO</h3>
                        <input
                            name="clientName"
                            type="text"
                            value={formData.clientName}
                            onChange={handleChange}
                            placeholder="Client Name"
                            className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <input
                            name="clientMobile"
                            type="text"
                            value={formData.clientMobile}
                            onChange={handleChange}
                            placeholder="Client Mobile"
                            className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <input
                            name="clientAddress"
                            type="text"
                            value={formData.clientAddress}
                            onChange={handleChange}
                            placeholder="Client Address"
                            className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <input
                            name="clientGstin"
                            type="text"
                            value={formData.clientGstin}
                            onChange={handleChange}
                            placeholder="Client GSTIN"
                            className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <input
                            name="clientState"
                            type="text"
                            value={formData.clientState}
                            onChange={handleChange}
                            placeholder="Client State"
                            className="text-sm w-full p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <h3 className="font-semibold mb-2">Select Item</h3>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <select
                                onChange={(e) => setSelectedItemId(Number(e.target.value))}
                                value={selectedItemId || ""}
                                className="text-sm w-full sm:w-1/4 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Select Item</option>
                                {availableItems.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.itemName} (Available: {item.quantity})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                min="1"
                                max={selectedItemId !== null ? availableItems.find(item => item.id === selectedItemId)?.quantity : 1}
                                placeholder="Quantity"
                                className="text-sm w-full sm:w-1/4 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                type="button"
                                onClick={addItem}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
                            >
                                Add Item
                            </button>
                        </div>
                    </div>

                    <table className="w-full mt-4">
                        <thead className="bg-[#e5faff]">
                            <tr>
                                <th className="p-2 text-left">S.NO.</th>
                                <th className="p-2 text-left">ITEMS</th>
                                <th className="p-2 text-right">QTY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">{item.itemName}</td>
                                    <td className="p-2 text-right">{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-between">
                        <div className="w-1/2">
                            <div className="text-left mb-4">
                                <h3 className="font-semibold mb-2">BANK DETAILS</h3>
                                <input
                                    name="bankName"
                                    type="text"
                                    value={companyDetails?.bankName}
                                    onChange={handleChange}
                                    placeholder="Bank Name"
                                    className="text-sm w-full mb-1 p-1 border rounded"
                                />
                                <input
                                    name="ifsc"
                                    type="text"
                                    value={companyDetails?.ifscCode}
                                    onChange={handleChange}
                                    placeholder="IFSC Code"
                                    className="text-sm w-full mb-1 p-1 border rounded"
                                />
                                <input
                                    name="accountNo"
                                    type="text"
                                    value={companyDetails?.accountNo}
                                    onChange={handleChange}
                                    placeholder="Account Number"
                                    className="text-sm w-full mb-1 p-1 border rounded"
                                />
                            </div>
                        </div>
                        <div className="w-full overflow-auto">
                            <div className="text-right mb-4">
                                <h3 className="font-semibold mb-2">PAYMENT QR CODE</h3>
                                <p className="text-sm">UPI ID: {companyDetails?.upiId}</p>
                                <input
                                    name="upiId"
                                    type="text"
                                    value={companyDetails?.upiId}
                                    onChange={handleChange}
                                    placeholder="UPI ID"
                                    className="text-sm w-full mb-1 p-1 border rounded"
                                />
                            </div>
                            <div className="text-right">
                                <input
                                    name="signature"
                                    type="file"
                                    accept="image/*"
                                    className="mb-2"
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                            setFormData({ ...formData, signature: URL.createObjectURL(files[0]) });
                                        }
                                    }}
                                />
                                <p className="text-sm">
                                    Authorised Signature for
                                    <br />
                                    HP TILES
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
                    >
                        Generate Delivery Challan
                    </button>
                </form>
            ) : (
                <div id="delivery-challan">
                    <div className="text-left flex justify-between items-center mb-2">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">HP TILES</h1>
                            <p className="text-sm">J1-197, 1st Phase, Sangaria, Jodhpur - 342013, Rajasthan.</p>
                            <p className="text-sm">GSTIN : 08ACAPL1601L1ZW</p>
                            <p className="text-sm">Mobile : 7014318580</p>
                            <p className="text-sm">PAN Number : ACAPL1601L</p>
                        </div>
                        <div className="text-right mb-6">
                            <h2 className="text-xl text-right font-semibold mb-3">Delivery Challan</h2>
                            <div className="flex justify-end gap-4">
                                <div className="text-left">
                                    <p className="text-sm">Challan No.: {formData.challanNo}</p>
                                    <p className="text-sm">Date: {formData.date}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#e5faff] text-left p-3 rounded">
                        <h3 className="mb-1 font-semibold">BILL TO</h3>
                        <p className="text-sm font-semibold">Name: {formData.clientName}</p>
                        <p className="text-sm font-semibold">Mobile: {formData.clientMobile}</p>
                        <p className="text-sm font-semibold">Address: {formData.clientAddress}</p>
                        <p className="text-sm font-semibold">GSTIN: {formData.clientGstin}</p>
                        <p className="text-sm font-semibold">State: {formData.clientState}</p>
                    </div>

                    <table className="w-full mt-4 border-2 border-black">
                        <thead className="bg-[#e5faff] border-2 border-black">
                            <tr>
                                <th className="p-1 text-left">S.NO.</th>
                                <th className="p-1 text-left">ITEMS</th>
                                <th className="p-1 text-right">QTY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.items.map((item, index) => (
                                <tr key={index} className="border-2 border-black">
                                    <td className="ps-3 text-left">{index + 1}</td>
                                    <td className="p-1 text-left">{item.itemName}</td>
                                    <td className="p-1 text-right">{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-[#e5faff]">
                            <tr>
                                <th className="p-1 text-left">TOTAL</th>
                                <th className="p-1 text-left"></th>
                                <th className="p-1 text-right">{formData.items.reduce((acc, curr) => acc + (curr.quantity || 0), 0)}</th>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="flex justify-between mt-4">
                        <div className="w-1/2">
                            <div className="mb-2 p-2 border text-left rounded">
                                <h3 className="font-semibold mb-2">BANK DETAILS</h3>
                                <p className="text-sm">Bank Name: {companyDetails?.bankName}</p>
                                <p className="text-sm">IFSC: {companyDetails?.ifscCode}</p>
                                <p className="text-sm">Account No: {companyDetails?.accountNo}</p>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="text-right mb-2">
                                <h3 className="font-semibold mb-2">PAYMENT QR CODE</h3>
                                <img src="" alt="QR Code" className="inline-block max-h-12" />
                                <p className="text-sm">UPI ID: {companyDetails?.upiId}</p>
                            </div>
                            <div className="text-right">
                                <img
                                    src={formData.signature}
                                    alt="Signature"
                                    className="inline-block mb-1 max-h-16"
                                />
                                <p className="text-sm">
                                    Authorised Signature for
                                    <br />
                                    HP TILES
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Print Delivery Challan
                    </button>
                </div>
            )}
        </div>
    );
};

export default DeliveryChallan;