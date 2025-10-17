import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Invoice {
    id: number;
    invoiceNo: string;
    invoiceDate: string;
    clientName: string;
    clientAddress: string;
    clientGstin: string;
    clientState: string;
    bankName: string;
    ifsc: string;
    accountNo: string;
    branch: string;
    upiId: string;
    taxableAmount: number;
    cgst: number;
    sgst: number;
    freight: number;
    totalAmount: number;
    amountInWords: string;
    signature: string;
    userId: number;
    stockName: string[];
    stockQuantity: number[];
    stockRate: number[];
    stockAmount: number[];
}

const ShowInvoices: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { userId } = useAuth();
    const API_URL = import.meta.env.VITE_VOISTOCK_API_URL || '';

    // Fetch all invoices from the backend
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                console.log(API_URL)
                const response = await axios.get<Invoice[]>(`${API_URL}/api/invoice/${userId}`);
                setInvoices(response.data || []); // Ensure it's always an array
                console.log("DATA CAME : ", response.data)
            } catch (error) {
                setInvoices([]); // Fallback to empty array
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [userId, API_URL]);

    // Print the invoice
    const handlePrint = () => {
        if (selectedInvoice) {
            const printWindow = window.open();

            // Create the HTML structure for the invoice
            printWindow?.document.write(`
            <html>
                <head>
                    <title>Invoice</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        #invoice { margin: 20px; }
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
                        .max-h-12 { max-height: 48px; }
                    </style>
                </head>
                <body>
                    <div id="invoice">
                        <div class="text-left flex justify-between items-center mb-2">
                            <div>
                                <h1 class="font-bold mb-2">HP TILES</h1>
                                <p class="text-sm mb-1">123 Tile Street</p>
                                <p class="text-sm mb-1">Tile City, State, 12345</p>
                                <p class="text-sm mb-1">GSTIN: GSTIN123456</p>
                                <p class="text-sm mb-1">Mobile: 123-456-7890</p>
                                <p class="text-sm">PAN: PAN123456</p>
                            </div>
                            <div class="text-right mb-2">
                                <h2 class="text-xl text-right font-semibold mb-3">TAX INVOICE</h2>
                                <div class="flex justify-end gap-4">
                                    <div class="text-left">
                                        <p class="text-sm">Invoice No.: ${selectedInvoice.invoiceNo}</p>
                                        <p class="text-sm">Invoice Date: ${selectedInvoice.invoiceDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-[#fddbc2] text-left p-1 rounded">
                            <h3 class="mb-1 font-semibold">BILL TO</h3>
                            <p class="text-sm font-semibold mb-1">Name: ${selectedInvoice.clientName}</p>
                            <p class="text-sm font-semibold mb-1"> Address: ${selectedInvoice.clientAddress}</p>
                            <p class="text-sm mb-1 font-semibold">GSTIN: ${selectedInvoice.clientGstin}</p>
                            <p class="text-sm font-semibold">State: ${selectedInvoice.clientState}</p>
                        </div>

                        <table class="w-full mt-2 border-2 border-black">
                            <thead class="bg-[#fddbc2] border-2 border-black">
                                <tr>
                                    <th class="p-1 text-left">S.NO.</th>
                                    <th class="p-1 text-left">ITEMS</th>
                                    <th class="p-1 text-right">QTY</th>
                                    <th class="p-1 text-right">RATE</th>
                                    <th class="p-1 text-right">AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(selectedInvoice?.stockName || []).map((item, index) => `
    <tr class="border-2 border-black">
        <td class="ps-3 text-left">${index + 1}</td>
        <td class="p-1 text-left">${item || ''}</td>
        <td class="p-1 text-right">${selectedInvoice?.stockQuantity?.[index] || ''}</td>
        <td class="p-1 text-right">${selectedInvoice?.stockRate?.[index] || ''}</td>
        <td class="p-1 text-right">${selectedInvoice?.stockAmount?.[index] || ''}</td>
    </tr>
`).join('')}
                            </tbody>
                            <tfoot class="bg-[#fddbc2]">
                                <tr>
                                    <th class="p-1 text-left">SUBTOTAL</th>
                                    <th class="ps-6 text-left">-</th>
                                    <th class="p-1 text-right">${(selectedInvoice.stockQuantity || []).reduce((acc, curr) => acc + curr, 0)}</th>
                                    <th class="p-1 text-right">-</th>
                                    <th class="p-1 text-right">${selectedInvoice.totalAmount || ''}</th>
                                </tr>
                            </tfoot>
                        </table>

                        <div class="flex justify-between mt-6">
                            <div class="w-1/2">
                                <div class="mb-2 p-2 border text-left rounded">
                                    <h3 class="font-semibold mb-2">BANK DETAILS</h3>
                                    <p class="text-sm font-semibold">Bank Name: ${selectedInvoice.bankName}</p>
                                    <p class="text-sm font-semibold">IFSC: ${selectedInvoice.ifsc}</p>
                                    <p class="text-sm font-semibold">Account No: ${selectedInvoice.accountNo}</p>
                                    <p class="text-sm font-semibold">Branch: ${selectedInvoice.branch}</p>
                                </div>
                                <div class="p-2 border rounded text-left">
                                    <p class="text-sm font-semibold">UPI ID:</p> <p>${selectedInvoice.upiId}</p>
                                    <h3 class="font-semibold mb-1">PAYMENT QR CODE</h3>
                                    <img src="" class="max-h-12" alt="qr_code" />
                                </div>
                            </div>
                            <div class="w-1/2 ms-3">
                                <table class="w-full mb-3 border-2 rounded border-black">
                                    <tbody>
                                        <tr>
                                            <td class="py-1 pe-1 text-right">TAXABLE AMOUNT</td>
                                            <td class="py-1 pe-1 text-right">${selectedInvoice.taxableAmount}</td>
                                        </tr>
                                        <tr>
                                            <td class="py-1 pe-1 text-right">CGST @9%</td>
                                            <td class="py-1 pe-1 text-right">${selectedInvoice.cgst}</td>
                                        </tr>
                                        <tr>
                                            <td class="py-1 pe-1 text-right">SGST @9%</td>
                                            <td class="py-1 pe-1 text-right">${selectedInvoice.sgst}</td>
                                        </tr>
                                        <tr>
                                            <td class="py-1 pe-1 text-right">Freight</td>
                                            <td class="py-1 pe-1 text-right">${selectedInvoice.freight}</td>
                                        </tr>
                                        <tr class="font-semibold border-2 border-black">
                                            <td class="py-1 text-center border-2 border-black">TOTAL AMOUNT</td>
                                            <td class="py-1 text-right">
                                                ${selectedInvoice.totalAmount}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="text-right mb-2">
                                    <p class="text-sm text-right">Total Amount ( in words):</p>
                                    <p class="text-sm mb-1">${selectedInvoice.amountInWords}</p>
                                </div>
                                <div class="text-right">
                                    <img
                                        src="${selectedInvoice.signature}"
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

    const handleInvoiceClick = (invoiceId: number) => {
        const invoice = invoices.find(inv => inv.id === invoiceId);
        if (invoice) {
            setSelectedInvoice(invoice);
        }
    };

    return (
        <div className="p-4 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Invoices</h1>
            {loading ? (
                <p>Loading invoices...</p>
            ) : invoices.length===0 ? (
                    <div className=''>
                        <p className=''>You Don't Have Any Invoices.</p>
                        <a href='/invoice'><button className='mt-3 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto p-2'>Create Invoice</button></a>
                    </div>
            ) : (
                <ul className="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-4">
                    {invoices.map(invoice => (
                        <li key={invoice.id} className="flex-1 mb-2">
                            <button
                                onClick={() => handleInvoiceClick(invoice.id)}
                                className="relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-indigo-500 rounded-md group w-full">
                                <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
                                </span>
                                <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-ml-4 group-hover:-mb-4">
                                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
                                </span>
                                <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-indigo-600 rounded-md group-hover:translate-x-0" />
                                <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                                    Invoice No: {invoice.invoiceNo}
                                    <br />
                                    Invoice Date: {invoice.invoiceDate}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedInvoice && (
                <div className="mt-4 p-4 border rounded bg-white shadow">
                    <h2 className="text-xl font-semibold">Invoice Details</h2>
                    <p><strong>Invoice No:</strong> {selectedInvoice.invoiceNo}</p>
                    <p><strong>Date:</strong> {selectedInvoice.invoiceDate}</p>
                    <h3 className="font-semibold">BILL TO</h3>
                    <p>{selectedInvoice.clientName}</p>
                    <p>{selectedInvoice.clientAddress}</p>
                    <h3 className="font-semibold">ITEMS</h3>
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr>
                                <th className="border p-2">S.NO.</th>
                                <th className="border p-2">ITEMS</th>
                                <th className="border p-2">QTY</th>
                                <th className="border p-2">RATE</th>
                                <th className="border p-2">AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(selectedInvoice.stockName || []).map((item, index) => (
                                <tr key={index || ''}>
                                    <td className="border p-2">{index + 1}</td>
                                    <td className="border p-2">{item || ''}</td>
                                    <td className="border p-2">{selectedInvoice.stockQuantity[index] || ''}</td>
                                    <td className="border p-2">{selectedInvoice.stockRate[index] || ''}</td>
                                    <td className="border p-2">{selectedInvoice.stockAmount[index] || ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3 className="font-semibold ">TOTAL AMOUNT: ₹{selectedInvoice.totalAmount || ''}</h3>
                    <button
                        onClick={handlePrint}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Print Invoice
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShowInvoices;