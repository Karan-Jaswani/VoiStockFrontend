import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { StockDashboard } from './components/StockDashboard';
import Invoice  from './components/Invoice';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import DeliveryChallan from './components/DeliveryChallan';
import Dashboard from './components/Dashboard';


function App() {
  return (
    <div className="App">
      <Navbar/>
      <Router>
        <Routes>
          <Route path="/" Component={Dashboard} />
          <Route path='/invoice' Component={Invoice}/>
          <Route path="/delivery-challan" Component={DeliveryChallan} />
          <Route path="/stock" Component={StockDashboard} />
        </Routes>
      </Router>
      <Footer/>
    </div>
  );
}

export default App;
