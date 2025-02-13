import React, { useState } from "react";

// Define interfaces for the form data
interface Item {
    itemNo: number;
    itemName: string;
    quantity: number;
}

interface FormData {
    challanNo: string;
    date: string;
    clientName: string;
    clientMobile: string;
    clientAddress: string;
    clientGstin: string;
    clientState: string;
    items: Item[];
    bankName: string;
    ifsc: string;
    accountNo: string;
    upiId: string;
    signature: string;
}

const DeliveryChallan: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        challanNo: "",
        date: "",
        clientName: "",
        clientMobile: "",
        clientAddress: "",
        clientGstin: "",
        clientState: "",
        items: [],
        bankName: "",
        ifsc: "",
        accountNo: "",
        upiId: "",
        signature: "",
    });

    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const addItem = () => {
        const newItem: Item = {
            itemNo: formData.items.length + 1,
            itemName: "",
            quantity: 0,
        };
        setFormData((prevData) => ({
            ...prevData,
            items: [...prevData.items, newItem],
        }));
    };

    const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedItems = [...formData.items];

        // Ensure name is a valid key of Item
        if (name === "itemName") {
            updatedItems[index].itemName = value; // itemName is a string
        } else if (name === "quantity") {
            updatedItems[index].quantity = parseInt(value) || 0; // quantity is a number
        }

        setFormData({ ...formData, items: updatedItems });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div id="webcrumbs">
            <div className="mx-auto w-full p-8 bg-white rounded-lg shadow-lg">
                {!submitted ? (
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between mb-8">
                            <div className="text-left">
                                <h1 className="text-2xl font-bold mb-2">HP TILES</h1>
                                <p className="text-sm">J1-197, 1st Phase, Sangaria, Jodhpur - 342013, Rajasthan.</p>
                                <p className="text-sm">GSTIN : 08ACAPL1601L1ZW</p>
                                <p className="text-sm">Mobile : 7014318580</p>
                                <p className="text-sm">PAN Number : ACAPL1601L</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-xl font-semibold mb-4">Delivery Challan</h2>
                                <div className="flex justify-end gap-4">
                                    <div>
                                        <input
                                            name="challanNo"
                                            type="text"
                                            value={formData.challanNo}
                                            onChange={handleChange}
                                            placeholder="Challan No."
                                            className="text-sm mb-1 p-1 border rounded"
                                            required
                                        />
                                        <input
                                            name="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="text-sm p-1 border rounded"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 mb-8">
                            <div className="text-left bg-[#e5faff] p-4 rounded">
                                <h3 className="font-semibold mb-2">BILL TO</h3>
                                <input
                                    name="clientName"
                                    type="text"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    placeholder="Client Name"
                                    className="text-sm w-full mb-1 p-1 border rounded"
                                    required
                                />
                                <input
                                    name="clientMobile"
                                    type="text"
                                    value={formData.clientMobile}
                                    onChange={handleChange}
                                    placeholder="Client Mobile"
                                    className="text-sm w-full mb-1 p-1 border rounded"
                                    required
                                />
                                <input
                                    name="clientAddress"
                                    type="text"
                                    value={formData.clientAddress}
                                    onChange={handleChange}
                                    placeholder="Client Address"
                                    className="text-sm w-full mb-1 p-1 border rounded"
                                    required
                                />
                                <input
                                    name="clientGstin"
                                    type="text"
                                    value={formData.clientGstin}
                                    onChange={handleChange}
                                    placeholder="Client GSTIN"
                                    className="text-sm w-full mb-1 p-1 border rounded"
                                    required
                                />
                                <input
                                    name="clientState"
                                    type="text"
                                    value={formData.clientState}
                                    onChange={handleChange}
                                    placeholder="Client State"
                                    className="text-sm w-full mb-1 p-1 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        <table className="w-full mb-8">
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
                                        <td className="p-2">{item.itemNo}</td>
                                        <td className="text-left p-2">
                                            <input
                                                name="itemName"
                                                type="text"
                                                value={item.itemName}
                                                onChange={(e) => handleItemChange(index, e)}
                                                placeholder="Item Name"
                                                className="text-sm w-full p-1 border rounded"
                                                required
                                            />
                                        </td>
                                        <td className="p-2 text-right">
                                            <input
                                                name="quantity"
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, e)}
                                                className="text-sm w-full p-1 border rounded"
                                                required
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button
                            type="button"
                            onClick={addItem}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
                        >
                            Add Item
                        </button>

                        <div className="flex justify-between">
                            <div className="w-1/2">
                                <div className="text-left mb-4">
                                    <h3 className="font-semibold mb-2">BANK DETAILS</h3>
                                    <input
                                        name="bankName"
                                        type="text"
                                        value={formData.bankName}
                                        onChange={handleChange}
                                        placeholder="Bank Name"
                                        className="text-sm w-full mb-1 p-1 border rounded"
                                        required
                                    />
                                    <input
                                        name="ifsc"
                                        type="text"
                                        value={formData.ifsc}
                                        onChange={handleChange}
                                        placeholder="IFSC Code"
                                        className="text-sm w-full mb-1 p-1 border rounded"
                                        required
                                    />
                                    <input
                                        name="accountNo"
                                        type="text"
                                        value={formData.accountNo}
                                        onChange={handleChange}
                                        placeholder="Account Number"
                                        className="text-sm w-full mb-1 p-1 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="w-full overflow-auto">
                                <div className="text-right mb-4">
                                    <h3 className="font-semibold mb-2">PAYMENT QR CODE</h3>
                                    <p className="text-sm">UPI ID: {formData.upiId}</p>
                                    <input
                                        name="upiId"
                                        type="text"
                                        value={formData.upiId}
                                        onChange={handleChange}
                                        placeholder="UPI ID"
                                        className="text-sm w-full mb-1 p-1 border rounded"
                                        required
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
                                        required
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
                                        <td className="ps-3 text-left">{item.itemNo}</td>
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
                                    <p className="text-sm">Bank Name: {formData.bankName}</p>
                                    <p className="text-sm">IFSC: {formData.ifsc}</p>
                                    <p className="text-sm">Account No: {formData.accountNo}</p>
                                </div>
                            </div>
                            <div className="w-1/2">
                                <div className="text-right mb-2">
                                    <h3 className="font-semibold mb-2">PAYMENT QR CODE</h3>
                                    <img src="" alt="QR Code" className="inline-block max-h-12" />
                                    <p className="text-sm">UPI ID: {formData.upiId}</p>
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
        </div>
    );
};

export default DeliveryChallan;