import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface DeliveryChallan {
    id: number;
    challanNo: string;
    date: string;
    clientName: string;
    clientMobile: string;
    clientAddress: string;
    clientGstin: string;
    clientState: string;
    bankName: string;
    ifsc: string;
    accountNo: string;
    upiId: string;
    signature: string;
    userId: number;
    itemName: string[];
    itemQuantity: number[];
}

const ShowDeliveryChallans: React.FC = () => {
    const [deliveryChallans, setDeliveryChallans] = useState<DeliveryChallan[]>([]);
    const [selectedChallan, setSelectedChallan] = useState<DeliveryChallan | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { userId } = useAuth();
    const API_URL = import.meta.env.VITE_VOISTOCK_API_URL || '';

    // Fetch all delivery challans from the backend
    useEffect(() => {
        const fetchDeliveryChallans = async () => {
            try {
                const response = await axios.get<DeliveryChallan[]>(`${API_URL}/api/dchallan/${userId}`);
                setDeliveryChallans(response.data); // Set the delivery challans state
            } catch (error) {
                console.error('Error fetching delivery challans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveryChallans();
    }, [userId, API_URL]); // Add userId to the dependency array

    // Print the delivery challan
    const handlePrint = () => {
        if (selectedChallan) {
            const printWindow = window.open();

            // Create the HTML structure for the delivery challan
            printWindow?.document.write(`
            <html>
                <head>
                    <title>Delivery Challan</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        #challan { margin: 20px; }
                        h1, h2, h3 { margin: 0; }
                        .text-left { text-align: left; }
                        .text-right { text-align: right; }
                        .border { border: 1px solid black; }
                        .border-2 { border: 2px solid black; }
                        .p-1 { padding: 5px; }
                        .p-2 { padding: 10px; }
                        .mb-1 { margin-bottom: 2px; }
                        .mb-2 { margin-bottom: 5px; }
                        .font-bold { font-weight: bold; }
                        .font-semibold { font-weight: 600; }
                        .rounded { border-radius: 5px; }
                        .w-full { width: 100%; }
                    </style>
                </head>
                <body>
                    <div id="challan">
                        <div class="text-left flex flex-col md:flex-row justify-between items-start mb-2">
                            <div>
                                <h1 class="font-bold mb-2">HP TILES</h1>
                                <p class="text-sm mb-1">J1-197, 1st Phase, Sangaria, Jodhpur - 342013, Rajasthan.</p>
                                <p class="text-sm mb-1">GSTIN: 08ACAPL1601L1ZW</p>
                                <p class="text-sm mb-1">Mobile: 7014318580</p>
                                <p class="text-sm">PAN: ACAPL1601L</p>
                            </div>
                            <div class="text-right mb-2">
                                <h2 class="text-xl text-right font-semibold mb-3">DELIVERY CHALLAN</h2>
                                <div class="flex justify-end gap-4">
                                    <div class="text-left">
                                        <p class="text-sm">Challan No.: ${selectedChallan.challanNo}</p>
                                        <p class="text-sm">Date: ${selectedChallan.date}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-[#e5faff] text-left p-1 rounded">
                            <h3 class="mb-1 font-semibold">BILL TO</h3>
                            <p class="text-sm font-semibold mb-1">Name: ${selectedChallan.clientName}</p>
                            <p class="text-sm font-semibold mb-1">Mobile: ${selectedChallan.clientMobile}</p>
                            <p class="text-sm font-semibold mb-1">Address: ${selectedChallan.clientAddress}</p>
                            <p class="text-sm font-semibold">GSTIN: ${selectedChallan.clientGstin}</p>
                            <p class="text-sm font-semibold">State: ${selectedChallan.clientState}</p>
                        </div>

                        <table class="w-full mt-2 border-2 border-black">
                            <thead class="bg-[#e5faff] border-2 border-black">
                                <tr>
                                    <th class="p-1 text-left">S.NO.</th>
                                    <th class="p-1 text-left">ITEMS</th>
                                    <th class="p-1 text-right">QTY</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${selectedChallan.itemName.map((item, index) => `
                                    <tr class="border-2 border-black">
                                        <td class="ps-3 text-left">${index + 1}</td>
                                        <td class="p-1 text-left">${item}</td>
                                        <td class="p-1 text-right">${selectedChallan.itemQuantity[index]}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>

                        <div class="flex justify-between mt-6">
                            <div class="w-1/2">
                                <div class="mb-2 p-2 border text-left rounded">
                                    <h3 class="font-semibold mb-2">BANK DETAILS</h3>
                                    <p class="text-sm font-semibold">Bank Name: ${selectedChallan.bankName}</p>
                                    <p class="text-sm font-semibold">IFSC: ${selectedChallan.ifsc}</p>
                                    <p class="text-sm font-semibold">Account No: ${selectedChallan.accountNo}</p>
                                </div>
                                <div class="p-2 border rounded text-left">
                                    <p class="text-sm font-semibold">UPI ID:</p> <p>${selectedChallan.upiId}</p>
                                    <h3 class="font-semibold mb-1">PAYMENT QR CODE</h3>
                                    <img src="" class="max-h-12" alt="qr_code" />
                                </div>
                            </div>
                            <div class="w-1/2">
                                <div class="text-right">
                                    <img
                                        src="${selectedChallan.signature}"
                                        alt="Signature"
                                        class="inline-block mb-1 max-h-14"
                                    />
                                    <p class="text-sm">
                                        Authorised Signature for
                                        <br />
                                        HP TILES
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `);
            printWindow?.document.close();
            printWindow?.print();
        }
    };

    const handleChallanClick = (challanId: number) => {
        const challan = deliveryChallans.find(ch => ch.id === challanId);
        if (challan) {
            setSelectedChallan(challan);
        }
    };

    return (
        <div className="p-4 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Delivery Challans</h1>
            {loading ? (
                <p>Loading delivery challans...</p>
            ) : deliveryChallans.length === 0 ? (
                <div className=''>
                    <p className=''>You Don't Have Any Delivery Challan.</p>
                    <a href='/delivery-challan'><button className='mt-3 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto p-2'>Create Delivery Challan</button></a>
                </div>
            ) : (
                <ul className="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-4">
                    {deliveryChallans.map(challan => (
                        <li key={challan.id} className="flex-1 mb-2">
                            <button
                                onClick={() => handleChallanClick(challan.id)}
                                className="relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-indigo-500 rounded-md group w-full">
                                <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
                                </span>
                                <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-ml-4 group-hover:-mb-4">
                                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
                                </span>
                                <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-indigo-600 rounded-md group-hover:translate-x-0" />
                                <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                                    Challan No: {challan.challanNo}
                                    <br />
                                    Date: {challan.date}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedChallan && (
                <div className="mt-4 p-4 border rounded bg-white shadow">
                    <h2 className="text-xl font-semibold">Delivery Challan Details</h2>
                    <p><strong>Challan No:</strong> {selectedChallan.challanNo}</p>
                    <p><strong>Date:</strong> {selectedChallan.date}</p>
                    <h3 className="font-semibold">BILL TO</h3>
                    <p>{selectedChallan.clientName}</p>
                    <p>{selectedChallan.clientMobile}</p>
                    <p>{selectedChallan.clientAddress}</p>
                    <h3 className="font-semibold">ITEMS</h3>
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr>
                                <th className="border p-2">S.NO.</th>
                                <th className="border p-2">ITEMS</th>
                                <th className="border p-2">QTY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedChallan.itemName.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-2">{index + 1}</td>
                                    <td className="border p-2">{item}</td>
                                    <td className="border p-2">{selectedChallan.itemQuantity[index]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        onClick={handlePrint}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Print Delivery Challan
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShowDeliveryChallans;