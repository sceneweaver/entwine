import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Root = ({ children }) => (
  <div id="main">
    <Navbar />
    <div id="root-children-wrapper">
      { children }
    </div>
    <Footer />
  </div>
);

export default Root;
