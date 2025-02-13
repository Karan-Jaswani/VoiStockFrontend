import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// Define interfaces for company details, form data, and items
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
  bankBranchName: string;
  upiId: string;
}

interface FormData {
  userId: number;
  address1: string;
  address2: string;
  gstin: string;
  mobile: string;
  pan: string;
  invoiceNo: string;
  invoiceDate: string;
  clientName: string;
  clientAddress: string;
  clientGstin: string;
  clientState: string;
  items: ItemType[];
  taxableAmount: string;
  cgst: string;
  sgst: string;
  freight: string;
  totalAmount: string;
  amountInWords: string;
  signature: string;
}

interface ItemType {
  id: number;
  itemName: string;
  quantity: number; // Available quantity
  rate: number;
  amount: number;
}

const Invoice: React.FC = () => {
  const [items, setItems] = useState<ItemType[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
      try {

        // Fetch user data based on userId
        const companyResponse = await axios.get(`http://localhost:8080/api/auth/user/${userId}`);

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
            bankBranchName: companyResponse.data.bankBranchName,
            upiId: companyResponse.data.upiId,
          })
        }

        const response = await fetch(`http://localhost:8080/api/stocks/${userId}`); // Replace with your API endpoint
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid JSON format: Expected an array");

        // Map the fetched data to the ItemType structure
        const mappedItems: ItemType[] = data.map((item: { id: number; itemName: string; price: number; quantity: number }) => ({
          id: item.id,
          itemName: item.itemName,
          quantity: item.quantity, // Use the quantity from the API response
          rate: item.price,
          amount: 0, // Initialize amount to 0
        }));

        setItems(mappedItems); // Set the mapped items to state
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [userId]);

  const [formData, setFormData] = useState<FormData>({
    userId: 0,
    address1: "",
    address2: "",
    gstin: "",
    mobile: "",
    pan: "",
    invoiceNo: "",
    invoiceDate: "",
    clientName: "",
    clientAddress: "",
    clientGstin: "",
    clientState: "",
    items: [],
    taxableAmount: "",
    cgst: "0",
    sgst: "0",
    freight: "",
    totalAmount: "",
    amountInWords: "",
    signature: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    if (selectedItemId === null) return;

    const selectedItem = items.find(item => item.id === selectedItemId);
    if (selectedItem) {
      if (quantity > selectedItem.quantity) {
        alert(`Cannot add more than available quantity (${selectedItem.quantity})`);
        return;
      }

      if (quantity < 1) {
        alert(`Add atleast 1 Quantity.`);
        return;
      }

      const newItem: ItemType = {
        id: selectedItem.id,
        itemName: selectedItem.itemName,
        quantity: quantity,
        rate: selectedItem.rate,
        amount: selectedItem.rate * quantity, // Calculate amount based on quantity
      };

      setFormData(prevData => ({
        ...prevData,
        items: [...prevData.items, newItem],
      }));

      // Deduct the quantity from the available items
      const updatedItems = items.map(item =>
        item.id === selectedItem.id ? { ...item, quantity: item.quantity - quantity } : item
      );

      setItems(updatedItems);
      setSelectedItemId(null);
      setQuantity(1);
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((acc, curr) => acc + (curr.amount ?? 0), 0).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    const invoiceData = {
      userId: sessionStorage.getItem("userId"),
      invoiceNo: formData.invoiceNo,
      invoiceDate: formData.invoiceDate,
      clientName: formData.clientName,
      clientAddress: formData.clientAddress,
      clientGstin: formData.clientGstin,
      clientState: formData.clientState,
      taxableAmount: parseFloat(calculateSubtotal()),
      cgst: parseFloat(formData.cgst),
      sgst: parseFloat(formData.sgst),
      freight: parseFloat(formData.freight || "0"),
      totalAmount: parseFloat(formData.totalAmount),
      amountInWords: formData.amountInWords,
      signature: formData.signature
    };
    
    if (formData.items.length < 1) {
        alert("Please Add Atleast 1 Item.");
        setSubmitted(false);
        return;
    } else {
      setSubmitted(true);
    }

    try {
      await axios.post('http://localhost:8080/api/invoice', invoiceData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("Invoice submitted successfully.");
    } catch (error) {
      console.error("Error during submission:", error);
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
              <h2 className="text-xl font-semibold mb-4">TAX INVOICE</h2>
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <div>
                  <input
                    name="invoiceNo"
                    type="text"
                    value={formData.invoiceNo}
                    onChange={handleChange}
                    placeholder="Invoice No."
                    className="text-sm mb-1 p-1 border rounded"
                    required
                  />
                  <input
                    name="invoiceDate"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={handleChange}
                    className="text-sm p-1 border rounded"
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
              className="text-sm w-full p-1 border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <h3 className="font-semibold mb-2">ITEMS</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <select
                value={selectedItemId || ""}
                onChange={(e) => setSelectedItemId(Number(e.target.value))}
                className="text-sm w-full sm:w-1/4 p-1 border rounded"
              >
                <option value="">Select Item</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.itemName} (Available: {item.quantity}, Rate: ₹{item.rate})
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="0"
                max={selectedItemId !== null ? items.find(item => item.id === selectedItemId)?.quantity : 1}
                placeholder="Quantity"
                className="text-sm w-full sm:w-1/4 p-1 border rounded"
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
            <thead className="bg-[#fddbc2]">
              <tr>
                <th className="p-2 text-left">S.NO.</th>
                <th className="p-2 text-left">ITEMS</th>
                <th className="p-2 text-right">QTY</th>
                <th className="p-2 text-right">RATE</th>
                <th className="p-2 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{item.itemName}</td>
                  <td className="p-2 text-right">{item.quantity}</td>
                  <td className="p-2 text-right">{item.rate}</td>
                  <td className="p-2 text-right">{item.amount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#fddbc2]">
              <tr>
                <th className="p-2 text-left">SUBTOTAL</th>
                <th className="p-2"></th>
                <th className="p-2 text-right">{formData.items.reduce((acc, curr) => acc + (curr.quantity || 0), 0)}</th>
                <th className="p-2"></th>
                <th className="p-2 text-right">{calculateSubtotal()}</th>
              </tr>
            </tfoot>
          </table>

          <div className="flex flex-col sm:flex-row justify-between mt-4">
            <div className="w-full sm:w-1/2">
              <div className="mb-4 p-4 border rounded">
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
                <input name="branch"
                  type="text"
                  value={companyDetails?.bankBranchName}
                  onChange={handleChange}
                  placeholder="Bank Branch"
                  className="text-sm w-full p-1 border rounded"
                />
              </div>
              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">PAYMENT QR CODE</h3>
                <p className="text-sm">UPI ID: {companyDetails?.upiId}</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <table className="w-full mb-4">
                <tbody>
                  <tr>
                    <td className="py-1 text-right">TAXABLE AMOUNT</td>
                    <td className="py-1 text-right">{parseFloat(calculateSubtotal()).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-right">CGST @9%</td>
                    <td className="py-1 text-right">{(parseFloat(calculateSubtotal()) * 0.09).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-right">SGST @9%</td>
                    <td className="py-1 text-right">{(parseFloat(calculateSubtotal()) * 0.09).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-right">Freight</td>
                    <td className="py-1 text-right">
                      <input
                        name="freight"
                        type="number"
                        step="0.01"
                        value={formData.freight || 0}
                        onChange={handleChange}
                        className="w-32 p-1 border rounded"
                      />
                    </td>
                  </tr>
                  <tr className="font-semibold">
                    <td className="py-1 text-right">TOTAL AMOUNT</td>
                    <td className="py-1 text-right">
                      {(
                        parseFloat(calculateSubtotal()) +
                        (parseFloat(calculateSubtotal()) * 0.09) +
                        (parseFloat(calculateSubtotal()) * 0.09) +
                        parseFloat(formData.freight || "0")
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="text-right mt-4">
                <p className="text-sm">Total Amount (in words):</p>
                <input
                  name="amountInWords"
                  type="text"
                  value={formData.amountInWords}
                  onChange={handleChange}
                  className="w-full p-1 border rounded"
                  required
                />
              </div>
              <div className="mt-8 text-right">
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
                  {companyDetails?.companyName}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
          >
            Generate Invoice
          </button>
        </form>
      ) : (
        <div id="invoice">
          <div className="text-left flex justify-between items-center mb-2">
            <div>
              <h1 className="font-bold mb-2">{companyDetails?.companyName}</h1>
              <p className="text-sm mb-1">{companyDetails?.address1}</p>
              <p className="text-sm mb-1">{companyDetails?.address2}</p>
              <p className="text-sm mb-1">GSTIN: {companyDetails?.gstin}</p>
              <p className="text-sm mb-1">Mobile: {companyDetails?.companyPhone}</p>
              <p className="text-sm">PAN: {companyDetails?.pan}</p>
            </div>
            <div className="text-right mb-6">
              <h2 className="text-xl text-right font-semibold mb-6">TAX INVOICE</h2>
              <div className="flex justify-end gap-4">
                <div className="text-left">
                  <p className="text -sm">Invoice No.: {formData.invoiceNo}</p>
                  <p className="text-sm">Invoice Date: {formData.invoiceDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#fddbc2] text-left p-1 rounded">
            <h3 className="mb-1 font-semibold">BILL TO</h3>
            <p className="text-sm font-semibold mb-1">Name: {formData.clientName}</p>
            <p className="text-sm font-semibold mb-1">Address: {formData.clientAddress}</p>
            <p className="text-sm mb-1 font-semibold">GSTIN: {formData.clientGstin}</p>
            <p className="text-sm font-semibold">State: {formData.clientState}</p>
          </div>

          <table className="w-full mt-2 border-2 border-black">
            <thead className="bg-[#fddbc2] border-2 border-black">
              <tr>
                <th className="p-1 text-left">S.NO.</th>
                <th className="p-1 text-left">ITEMS</th>
                <th className="p-1 text-right">QTY</th>
                <th className="p-1 text-right">RATE</th>
                <th className="p-1 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index} className="border-2 border-black">
                  <td className="ps-3 text-left">{index + 1}</td>
                  <td className="p-1 text-left">{item.itemName}</td>
                  <td className="p-1 text-right">{item.quantity}</td>
                  <td className="p-1 text-right">{item.rate.toFixed(2)}</td>
                  <td className="p-1 text-right">{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#fddbc2]">
              <tr>
                <th className="p-1 text-left">SUBTOTAL</th>
                <th className="ps-6 text-left">-</th>
                <th className="p-1 text-right border-2 border-black">{formData.items.reduce((acc, curr) => acc + curr.quantity, 0)}</th>
                <th className="p-1 text-right border-2 border-black">-</th>
                <th className="p-1 text-right">{calculateSubtotal()}</th>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-between mt-3">
            <div className="w-1/2">
              <div className="mb-2 p-2 border text-left rounded">
                <h3 className="font-semibold mb-2">BANK DETAILS</h3>
                <p className="text-sm font-semibold">Bank Name: {companyDetails?.bankName}</p>
                <p className="text-sm font-semibold">IFSC: {companyDetails?.ifscCode}</p>
                <p className="text-sm font-semibold">Account No: {companyDetails?.accountNo}</p>
                <p className="text-sm font-semibold">Branch: {companyDetails?.bankBranchName}</p>
              </div>
              <div className="p-2 border rounded text-left">
                <p className="text-sm font-semibold">UPI ID:</p> <p>{companyDetails?.upiId}</p>
                <h3 className="font-semibold mb-1">PAYMENT QR CODE</h3>
                <img src="" className="max-h-12" alt="qr_code" />
              </div>
            </div>
            <div className="w-1/2 ms-3">
              <table className="w-full mb-3 border-2 rounded border-black">
                <tbody>
                  <tr>
                    <td className="py-1 pe-1 text-right">TAXABLE AMOUNT</td>
                    <td className="py-1 pe-1 text-right">{parseFloat(calculateSubtotal()).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 pe-1 text-right">CGST @9%</td>
                    <td className="py-1 pe-1 text-right">{(parseFloat(calculateSubtotal()) * 0.09).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 pe-1 text-right">SGST @9%</td>
                    <td className="py-1 pe-1 text-right">{(parseFloat(calculateSubtotal()) * 0.09).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 pe-1 text-right">Freight</td>
                    <td className="py-1 pe-1 text-right">{parseFloat(formData.freight || "0").toFixed(2)}</td>
                  </tr>
                  <tr className="font-semibold border-2 border-black">
                    <td className="py-1 text-center border-2 border-black">TOTAL AMOUNT</td>
                    <td className="py-1 text-right">
                      {(
                        parseFloat(calculateSubtotal()) +
                        (parseFloat(calculateSubtotal()) * 0.09) +
                        (parseFloat(calculateSubtotal()) * 0.09) +
                        parseFloat(formData.freight || "0")
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="text-right mb-2">
                <p className="text-sm text-right">Total Amount (in words):</p>
                <p className="text-sm mb-1">{formData.amountInWords}</p>
              </div>
              <div className="text-right">
                <img
                  src={formData.signature}
                  alt="Signature"
                  className="inline-block mb-1 max-h-14"
                />
                <p className="text-sm">
                  Authorised Signature for
                  <br />
                  {companyDetails?.companyName}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Print Invoice
          </button>
        </div>
      )}
    </div>
  );
}
export default Invoice;