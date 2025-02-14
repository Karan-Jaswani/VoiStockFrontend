// src/routes/AppRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../context/ProtectedRoute";
import { StockDashboard } from "../components/StockDashboard";
import Invoice from "../components/Invoice";
import DeliveryChallan from "../components/DeliveryChallan";
import Dashboard from "../components/Dashboard";
import ShowInvoices from "../components/ShowInvoices";
import { Login } from "../components/Login";
import { Signup } from "../components/Signup";
import { VerifyOtp } from "../components/Verify-Otp";
import { Profile } from "../components/Profile";
import { UpdateProfile } from "../components/UpdateProfile";
import ShowDeliveryChallans from "../components/ShowDeliveryChallans";
import { CompanyDetails } from "../components/CompanyDetails";
import { UpdateCompanyDetails } from "../components/UpdateCompanyDetails";
import { LandingPage } from "../components/LandingPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/invoice"
                element={
                    <ProtectedRoute>
                        <Invoice />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/show-invoices"
                element={
                    <ProtectedRoute>
                        <ShowInvoices />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/delivery-challan"
                element={
                    <ProtectedRoute>
                        <DeliveryChallan />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/show-delivery-challans"
                element={
                    <ProtectedRoute>
                        <ShowDeliveryChallans />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/stock"
                element={
                    <ProtectedRoute>
                        <StockDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/company-details"
                element={
                    <ProtectedRoute>
                        <CompanyDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/update-company-details"
                element={
                    <ProtectedRoute>
                        <UpdateCompanyDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/update-profile"
                element={
                    <ProtectedRoute>
                        <UpdateProfile />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
