import React from 'react';
import Navbar from './Navbar';
import Navbar2 from './Navbar2';
import useAuth from '../hooks/useAuth.js';

const AppNavbar = () => {
  const {User , loading} = useAuth();

  if(loading){
    return null;
  }
  return User ? <Navbar2 /> : <Navbar />;
}

export default AppNavbar