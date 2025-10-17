import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the shape of the company data
interface CompanyData {
    companyName: string;
    address1: string;
    address2: string;
    gstin: string;
    companyPhone: number;
    pan: string;
    bankName: string;
    ifscCode: string;
    accountNo: string;
    bankBranchName: string;
    upiId: string;
}

export const UpdateCompanyDetails: React.FC = () => {
    const navigate = useNavigate();
    const userId = sessionStorage.getItem("userId");
    const [companyData, setCompanyData] = useState<CompanyData | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const API_URL = import.meta.env.VITE_VOISTOCK_API_URL || '';


    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                if (!userId) return;

                const response = await axios.get(`${API_URL}/api/auth/user/${userId}`);

                if (response.data) {
                    setCompanyData({
                        companyName: response.data.companyName,
                        address1: response.data.address1,
                        address2: response.data.address2,
                        gstin: response.data.gstin,
                        companyPhone: response.data.companyPhone,
                        pan: response.data.pan,
                        bankName: response.data.bankName,
                        ifscCode: response.data.ifscCode,
                        accountNo: response.data.accountNo,
                        bankBranchName: response.data.bankBranchName,
                        upiId: response.data.upiId,
                    });
                }
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        };

        fetchCompanyData();
    }, [userId, API_URL]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);

        const formData = new FormData(e.currentTarget);
        const updatedCompanyData = Object.fromEntries(formData);

        try {
            const response = await axios.put(`${API_URL}/api/auth/update/company/${userId}`, updatedCompanyData);

            if (response.status === 200) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/company-details");
                }, 2000);
            }
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsUpdating(false);
        }
    };


    if (!companyData) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold text-gray-600">Loading company details...</p>
            </div>
        );
    }


    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-lg font-medium mb-2">Company Name</label>
                                <input type="text" name="companyName" defaultValue={companyData.companyName} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter company name" />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Address 1</label>
                                <input type="text" name="address1" defaultValue={companyData.address1} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter address 1" />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Address 2</label>
                                <input type="text" name="address2" defaultValue={companyData.address2} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter address 2" />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">GSTIN</label>
                                <input type="text" name="gstin" defaultValue={companyData.gstin} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter GSTIN" />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Company Phone</label>
                                <input type="tel" name="companyPhone" defaultValue={companyData.companyPhone} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter company phone number" />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">PAN</label>
                                <input type="text" name="pan" defaultValue={companyData.pan} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter PAN" />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Bank Name</label>
                                <input type="text" name="bankName" defaultValue={companyData.bankName} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter bank name" />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">IFSC Code</label>
                                <input type="text" name="ifscCode" defaultValue={companyData.ifscCode} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter IFSC code" />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Account Number</label>
                                <input type="text" name="accountNo" defaultValue={companyData.accountNo} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter account number" />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Bank Branch Name</label>
                                <input type="text" name="bankBranchName" defaultValue={companyData.bankBranchName} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter bank branch name" />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">UPI ID</label>
                                <input type="text" name="upiId" defaultValue={companyData.upiId} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter UPI ID" />
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transform transition-all">
                                {isUpdating ? "Updating..." : "Update Company"}
                            </button>
                        </div>

                        {success && (
                            <div className="mt-4 flex justify-center">
                                <div className="w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
                                <span className="ml-2 text-green-600">Company details updated successfully! Redirecting...</span>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};