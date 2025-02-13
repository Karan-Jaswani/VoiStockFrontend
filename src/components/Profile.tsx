import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Define the shape of the user data
interface UserData {
    username: string;
    userEmail: string;
    userPhonenum: string;
    userState: string;
    userFirstName: string;
    userProfileUrl: string;
}
 // Ensure this is not an empty string
export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const userId = sessionStorage.getItem("userId"); // Ensure this value is stored correctly
    // const apiUrl = process.env.REACT_APP_ENV === 'production'
    //     ? process.env.REACT_APP_LIVE_API
    //     : process.env.REACT_APP_LOCAL_API;

    const [userData, setUserData] = useState<UserData | null>(null); // Set initial state to null

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!userId) return; // If there's no userId, stop execution

                // Fetch user data based on userId
                const response = await axios.get(`http://localhost:8080/api/auth/user/${userId}`);

                if (response.data) {
                    // Map response data to state
                    setUserData({
                        username: response.data.username,
                        userEmail: response.data.email,
                        userPhonenum: response.data.phonenum,
                        userState: response.data.state,
                        userFirstName: response.data.name,
                        userProfileUrl: response.data.profileurl,
                    });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [userId]); // Add apiUrl to dependencies to ensure it updates if needed

    const handleLogout = () => {
        sessionStorage.clear();
        setUserData(null);
        navigate("/");
    };

    const handleUpdateProfile = () => {
        navigate("/update-profile");
    };

    if (!userData) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold text-gray-600">Loading profile...</p>
            </div>
        );
    }

    const imageUrl = userData.userProfileUrl;
    
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">

            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden p-6">
                    <div className="space-y-6">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
                                    <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 text-left">
                            <div>
                                <label className="block text-lg font-medium mb-2">Full Name</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.userFirstName}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Email Address</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.userEmail}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Phone Number</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.userPhonenum || "Add Number by Updating Profile"}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Username</label>
                                <p className="text-gray-700 text-lg font-semibold">@{userData.username}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">State</label>
                                <p className="text-gray-700 text-lg font-semibold">{userData.userState}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={handleUpdateProfile}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transform transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
                            >
                                Update Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red- 700 active:bg-red-800 transform transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};