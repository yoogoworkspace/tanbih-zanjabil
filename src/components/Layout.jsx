import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './ui/Header';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <Outlet />
    </>
  );
};

export default Layout;