import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: true },
    { name: 'Invoice', href: '/invoice', current: false },
    { name: 'View Invoices', href: '/show-invoices', current: false },
    { name: 'Delivery Challan', href: '/delivery-challan', current: false },
    { name: 'View Delivery Challans', href: '/show-delivery-challans', current: false },
    { name: 'Stock', href: '/stock', current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

interface UserData {
    username: string;
    userEmail: string;
    userPhonenum: string;
    userState: string;
    userFirstName: string;
    userProfileUrl: string;
}

export const Navbar: React.FC = () => {
    const userId = sessionStorage.getItem("userId");
    const [userData, setUserData] = useState<UserData | null>(null);
    const { isAuthenticated, setAuthStatus } = useAuth();
    const navigate = useNavigate();
    const APP_LOGO_URL = process.env.REACT_APP_LOGO_URL;
    const API_URL = process.env.REACT_APP_VOISTOCK_API_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!userId) return;
                const response = await axios.get(`${API_URL}/api/auth/user/${userId}`);
                if (response.data) {
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
    }, [userId, API_URL]);

    const handleLogout = () => {
        sessionStorage.clear();
        setUserData(null);
        setAuthStatus(false);
        navigate("/");
    };

    return (
        <Disclosure as="nav" className="bg-gray-800">
            <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <a href='/'>
                                <img alt="Your Company" src={APP_LOGO_URL} className="h-16 w-auto" />
                            </a>
                        </div>
                        <div className="hidden mt-4 sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <a key={item.name} href={item.href} className={classNames(item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium')}>
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <Menu as="div" className="relative ml-3">
                            <div>
                                {isAuthenticated ? (
                                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                        {userData?.userProfileUrl ? (
                                            <img alt="User Profile" src={userData.userProfileUrl} className="size-10 rounded-full" />
                                        ) : (
                                            <div className="size-10 rounded-full bg-gray-500" />
                                        )}
                                    </MenuButton>
                                ) : (
                                    <button onClick={() => navigate('/login')} className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                        Login
                                    </button>
                                )}
                            </div>
                            {isAuthenticated && (
                                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5">
                                    <MenuItem><a href="/profile" className="block px-4 py-2 text-sm text-gray-700">Your Profile</a></MenuItem>
                                    <MenuItem><a href="/company-details" className="block px-4 py-2 text-sm text-gray-700">Company Details</a></MenuItem>
                                    <MenuItem><a href="/update-profile" className="block px-4 py-2 text-sm text-gray-700">Settings</a></MenuItem>
                                    <MenuItem><button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700">Sign out</button></MenuItem>
                                </MenuItems>
                            )}
                        </Menu>
                    </div>
                </div>
            </div>
        </Disclosure>
    );
};

export default Navbar;
