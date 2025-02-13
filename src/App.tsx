import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StockDashboard } from './components/StockDashboard';
import Invoice from './components/Invoice';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import DeliveryChallan from './components/DeliveryChallan';
import Dashboard from './components/Dashboard';
import ShowInvoices from './components/ShowInvoices';
import { ProtectedRoute } from './context/ProtectedRoute';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { VerifyOtp } from './components/Verify-Otp';
import { Profile } from './components/Profile';
import { UpdateProfile } from './components/UpdateProfile';
import ShowDeliveryChallans from './components/ShowDeliveryChallans';
import { CompanyDetails } from './components/CompanyDetails';
import { UpdateCompanyDetails } from './components/UpdateCompanyDetails';


function App() {
  return (
    <div className="App">
      <Router>
      <Navbar />
        <Routes>
          <Route
            path="/"
            element={
                <Dashboard />
            }
          />
          <Route
            path="/verify-otp"
            element={
              <VerifyOtp />
            }
          />
          <Route
            path="/login"
            element={
              <Login />
            }
          />
          <Route
            path="/signup"
            element={
              <Signup />
            }
          />
          <Route
            path='/invoice'
            element={
              <ProtectedRoute>
                <Invoice />
              </ProtectedRoute>
            }
          />
          <Route
            path='/show-invoices'
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
                <ShowDeliveryChallans/>
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
                <Profile/>
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
      <Footer />
      </Router>
    </div>
  );
}

export default App;