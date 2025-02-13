import React, { useState, useEffect } from "react";

// Define interfaces for company details, form data, and items
interface CompanyDetails {
  name: string;
  address1: string;
  address2: string;
  gstin: string;
  mobile: string;
  pan: string;
}

interface FormData {
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
  bankName: string;
  ifsc: string;
  accountNo: string;
  branch: string;
  upiId: string;
  taxableAmount: string;
  cgst: string;
  sgst: string;
  freight: string;
  totalAmount: string;
  amountInWords: string;
  signature: string;
}

interface ItemType {
  itemNo: number;
  itemName: string;
  quantity: number; // Change to number for easier calculations
  rate: number;
  amount: number;
}

const Invoice: React.FC = () => {
  const [items, setItems] = useState<ItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemType>({
    itemNo: 0,
    itemName: "",
    quantity: 1, // Default quantity as a number
    rate: 0,
    amount: 0,
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("items.json"); // Ensure it's correctly located
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging log

        if (!Array.isArray(data)) throw new Error("Invalid JSON format: Expected an array");

        // Map the fetched data to the ItemType structure
        const mappedItems: ItemType[] = data.map((item: { id: number; name: string; rate: number; quantity: number }) => ({
          itemNo: item.id,
          itemName: item.name,
          quantity: item.quantity, // Use the quantity from the JSON
          rate: item.rate,
          amount: item.rate * 1, // Calculate amount
        }));

        setItems(mappedItems); // Set the mapped items to state
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  // Static company details
  const companyDetails: CompanyDetails = {
    name: "HP TILES",
    address1: "123 Tile Street",
    address2: "Tile City, State, 12345",
    gstin: "GSTIN123456",
    mobile: "123-456-7890",
    pan: "PAN123456",
  };

  const handleSelectChange = (selectedItemNo: number) => {
    const selectedItem = items.find((itm) => itm.itemNo === selectedItemNo);
    if (selectedItem) {
      setSelectedItem(selectedItem);
    }
  };

  const [formData, setFormData] = useState<FormData>({
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
    bankName: "",
    ifsc: "",
    accountNo: "",
    branch: "",
    upiId: "",
    taxableAmount: "",
    cgst: "0",
    sgst: "0",
    freight: "",
    totalAmount: "",
    amountInWords: "",
    signature: "",
  });

  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    if (!selectedItem) return; // Ensure an item is selected before adding

    const newItem: ItemType = {
      itemNo: selectedItem.itemNo,
      itemName: selectedItem.itemName,
      quantity: selectedItem.quantity, // Use the selected item's quantity
      rate: selectedItem.rate,
      amount: selectedItem.rate * selectedItem.quantity, // Calculate amount based on quantity
    };

    setFormData((prevData) => ({
      ...prevData,
      items: [...prevData.items, newItem],
    }));
  };

  const calculateSubtotal = () => {
    return formData.items
      .reduce((acc, curr) => acc + (curr.amount ?? 0), 0)
      .toFixed(2);
  };

  const calculategst = () => {
    if (tax === true) {
      let gstt = formData.items.reduce(
        (acc, curr) => acc + (curr.amount ?? 0), 0
      );

      gstt = parseFloat(gstt.toFixed(2)); // Ensure it's a number
      let final = gstt * 0.09;
      return final.toFixed(2); // Return GST value

    } else {
      return "0.00"; // Return as string for consistency
    }
  };

  const calculateTotal = () => {
    let total =
      parseFloat(calculateSubtotal()) +
      parseFloat(formData.freight || "0") +
      parseFloat(calculategst()) +
      parseFloat(calculategst());
    return total.toFixed(2);
  };

  const [tax, setTax] = useState<boolean>(false);
  const [taxName, setTaxName] = useState<string>("Remove Tax");

  const trig_tax = () => {
    if (tax === true) {
      setTax(false);
      setTaxName("Add Tax");
    } else {
      setTax(true);
      setTaxName("Remove Tax");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Update the quantity of the selected item in the items state
    setItems(prevItems =>
      prevItems.map(item =>
        item.itemNo === selectedItem.itemNo
          ? { ...item, quantity: item.quantity - selectedItem.quantity } // Deduct the quantity
          : item
      )
    );

    // Here you would typically send a request to your backend to update the JSON file
    // For example:
    // await updateItemsOnServer(items);

    setSubmitted(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full p-8 bg-white rounded-lg shadow-lg mx-auto">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <h1 className="text-2xl font-bold mb-2 hover:text-blue-600 transition-colors duration-300">{companyDetails.name}</h1>
              <p className="text-sm">{companyDetails.address1}</p>
              <p className="text-sm">{companyDetails.address2}</p>
              <p className="text-sm">GSTIN: {companyDetails.gstin}</p>
              <p className="text-sm">Mobile: {companyDetails.mobile}</p>
              <p className="text-sm">PAN: {companyDetails.pan}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold mb-4 hover:text-blue-600 transition-colors duration-300">TAX INVOICE</h2>
              <div className="flex justify-end gap-4">
                <div>
                  <p className="text-sm">Invoice No. :</p>
                  <p className="text-sm">Invoice Date :</p>
                </div>
                <div>
                  <input
                    name="invoiceNo"
                    type="text"
                    value={formData.invoiceNo}
                    onChange={handleChange}
                    placeholder="INV-2024-001"
                    className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <input
                    name="invoiceDate"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={handleChange}
                    className="text-sm w-full p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
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

          <div className="grid grid-cols-1 gap-8">
            <h3 className="font-semibold mb-2">ITEMS</h3>
            <div className="flex space-x-2">
              {/* Dropdown to select an item */}
              <select
                value={selectedItem?.itemNo || ""}
                onChange={(e) => handleSelectChange(parseInt(e.target.value))}
                className="text-sm w-1/4 p-1 border rounded"
              >
                <option value="">Select Item</option>
                {items.map((itm) => (
                  <option key={itm.itemNo} value={itm.itemNo}>
                    {itm.itemName} (Available: {itm.quantity}, Rate: ₹{itm.rate})
                  </option>
                ))}
              </select>

              {/* Quantity Input */}
              <input
                name="quantity"
                type="number"
                value={selectedItem?.quantity}
                onChange={(e) => {
                  const newQuantity = Math.min(Number(e.target.value), selectedItem?.quantity);
                  setSelectedItem({ ...selectedItem, quantity: newQuantity });
                }}
                placeholder="Quantity"
                className="text-sm w-1/4 p-1 border rounded"
                min="1"
                max={selectedItem?.quantity}
              />


              {/* Rate Input */}
              <input
                name="rate"
                type="number"
                value={selectedItem?.rate}
                disabled // Keep rate fixed
                className="text-sm w-1/4 p-1 border rounded bg-gray-200"
              />

              {/* Add Item Button */}
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
                  <td className="p-2">{item.itemNo}</td>
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

          <div className="flex justify-between mt-4">
            <div className="w-1/2">
              <div className="mb-4 p-4 border rounded">
                <h3 className="font-semibold mb-2">BANK DETAILS</h3>
                <input
                  name="bankName"
                  type="text"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Bank Name"
                  className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  name="ifsc"
                  type="text"
                  value={formData.ifsc}
                  onChange={handleChange}
                  placeholder="IFSC Code"
                  className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  name="accountNo"
                  type="text"
                  value={formData.accountNo}
                  onChange={handleChange}
                  placeholder="Account Number"
                  className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  name="branch"
                  type="text"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Bank Branch"
                  className="text-sm w-full p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">PAYMENT QR CODE</h3>
                <p className="text-sm">UPI ID: {formData.upiId}</p>
              </div>
            </div>
            <div className="w-1/2">
              <table className="w-full mb-4">
                <tbody>
                  <tr>
                    <td className="py-1 text-right">
                      <button type={'button'} onClick={trig_tax} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{taxName}</button>
                    </td>
                    <td className="py-1 text-right"></td>
                  </tr>
                  <tr>
                    <td className="py-1 text-right">TAXABLE AMOUNT</td>
                    <td className="py-1 text-right">
                      {parseFloat(calculateSubtotal()).toFixed(2)}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-1 text-right">CGST @9%</td>
                    <td className="py-1 text-right">
                      {calculategst()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-right">SGST @9%</td>
                    <td className="py-1 text-right">
                      {calculategst()}
                    </td>
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
                        className="w-32 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </td>
                  </tr>
                  <tr className="font-semibold">
                    <td className="py-1 text-right">TOTAL AMOUNT</td>
                    <td className="py-1 text-right">
                      {Math.round(parseFloat(calculateTotal()))}
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
                  className="w-full p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  required
                />
                <p className="text-sm">
                  Authorised Signature for
                  <br />
                  {companyDetails.name}
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
              <h1 className="font-bold mb-2">{companyDetails.name}</h1>
              <p className="text-sm mb-1">{companyDetails.address1}</p>
              <p className="text-sm mb-1">{companyDetails.address2}</p>
              <p className="text-sm mb-1">GSTIN: {companyDetails.gstin}</p>
              <p className="text-sm mb-1">Mobile: {companyDetails.mobile}</p>
              <p className="text-sm">PAN: {companyDetails.pan}</p>
            </div>
            <div className="text-right mb-6">
              <h2 className="text-xl text-right font-semibold mb-6">TAX INVOICE</h2>
              <div className="flex justify-end gap-4">
                <div className="text-left">
                  <p className="text-sm">Invoice No.: {formData.invoiceNo}</p>
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
                  <td className="ps-3 text-left">{item.itemNo}</td>
                  <td className="p-1 text-left">{item.itemName}</td>
                  <td className="p-1 text-right">{item.quantity}</td>
                  <td className="p-1 text-right">{item.rate.toFixed(2)}</td>
                  <td className="p-1 text-right">{item.amount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#fddbc2]">
              <tr>
                <th className="p-1 text-left">SUBTOTAL</th>
                <th className="ps-6 text-left">-</th>
                <th className="p-1 text-right border-2 border-black">{formData.items.reduce((acc, curr) => acc + curr.quantity || 0, 0).toFixed(2)}</th>
                <th className="p-1 text-right border-2 border-black">-</th>
                <th className="p-1 text-right">{parseFloat(calculateSubtotal()).toFixed(2)}</th>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-between mt-3">
            <div className="w-1/2">
              <div className="mb-2 p-2 border text-left rounded">
                <h3 className="font-semibold mb-2">BANK DETAILS</h3>
                <p className="text-sm font-semibold">Bank Name: {formData.bankName}</p>
                  <p className="text-sm font-semibold">IFSC: {formData.ifsc}</p>
                  <p className="text-sm font-semibold">Account No: {formData.accountNo}</p>
                  <p className="text-sm font-semibold">Branch: {formData.branch}</p>
              </div>
              <div className="p-2 border rounded text-left">
                  <p className="text-sm font-semibold">UPI ID:</p> <p>{formData.upiId}</p>
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
                    <td className="py-1 pe-1 text-right">{parseFloat(formData.cgst).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 pe-1 text-right">SGST @9%</td>
                    <td className="py-1 pe-1 text-right">{parseFloat(formData.sgst).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 pe-1 text-right">Freight</td>
                    <td className="py-1 pe-1 text-right">{parseFloat(formData.freight).toFixed(2)}</td>
                  </tr>
                  <tr className="font-semibold border-2 border-black">
                    <td className="py-1 text-center border-2 border-black">TOTAL AMOUNT</td>
                    <td className="py-1 text-right">
                      {(parseFloat(calculateSubtotal()) + parseFloat(formData.cgst || "0") + parseFloat(formData.sgst || "0") + parseFloat(formData.freight || "0")).toFixed(2)}
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
                  {companyDetails.name}
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
};

export default Invoice;