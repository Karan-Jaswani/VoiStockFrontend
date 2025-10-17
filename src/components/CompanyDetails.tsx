import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Define the shape of the user data
interface UserData {
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
// Ensure this is not an empty string
export const CompanyDetails: React.FC = () => {
    const navigate = useNavigate();
    const userId = sessionStorage.getItem("userId"); // Ensure this value is stored correctly
    // const apiUrl = process.env.REACT_APP_ENV === 'production'
    //     ? process.env.REACT_APP_LIVE_API
    //     : process.env.REACT_APP_LOCAL_API;
    
    const [userData, setUserData] = useState<UserData | null>(null); // Set initial state to null
    const API_URL = import.meta.env.VITE_VOISTOCK_API_URL || '';
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!userId) return; // If there's no userId, stop execution

                // Fetch user data based on userId
                const response = await axios.get(`${API_URL}/api/auth/user/${userId}`);
                console.log(API_URL)
                if (response.data) {
                    // Map response data to state
                    setUserData({
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
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [userId, API_URL]); // Add apiUrl to dependencies to ensure it updates if needed

    const handleUpdateProfile = () => {
        navigate("/update-company-details");
    };

    if (!userData) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold text-gray-600">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">

            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden p-6">
                    <div className="space-y-6">

                        <div className="space-y-4 text-left">
                            <div>
                                <label className="block text-lg font-medium mb-2">Company Name</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.companyName}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Company Address 1</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.address1}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Company Address 2</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.address2}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Company Phone Number</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.companyPhone || "Add Company Phone Number by Updating Profile"}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Company GST IN</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.gstin}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Company PAN</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.pan}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Bank Name</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.bankName}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Bank Account No.</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.accountNo}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Company IFSC Code</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.ifscCode}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Bank Branch</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.bankBranchName}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">UPI ID</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.upiId}</p>
                            </div>

                        </div>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={handleUpdateProfile}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transform transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
                            >
                                Update Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};