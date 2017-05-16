import React from 'react';
import Navbar from './Navbar';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const Root = ({ children }) => (
  <div id="main">
    <Navbar />
    <div id="root-children-wrapper">
      {children}
    </div>
  </div>
);

export default Root;
