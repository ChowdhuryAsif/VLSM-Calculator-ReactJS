import React from 'react';

import NavBar from '../components/Navbar';
import HomeLayout from '../layout/HomeLayout';
import Footer from '../components/Footer';

import '../main.css';

const Home = () => {
  return (
    <div className="Home bg-dark">
      <NavBar />
      <HomeLayout />
      <Footer />
    </div>
  );
};

export default Home;
