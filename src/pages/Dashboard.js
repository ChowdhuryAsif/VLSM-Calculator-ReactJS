import React from 'react';

import NavBar from '../components/Navbar';
import DashboardLayout from '../layout/DashboardLayout';
import Footer from '../components/Footer';

import '../main.css';

const Dashboard = () => {
  return (
    <div className="Dashboard bg-dark">
      <NavBar />
      <DashboardLayout />
      <Footer />
    </div>
  );
};

export default Dashboard;
