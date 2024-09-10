import React from 'react';
import "./navbar.css"
import { Link } from "react-router-dom";
import { ShoppingCart } from 'phosphor-react';
import Logo_Course from "../assets/Logo_Course.png"
import Profile_User from "../assets/Profile.png"

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={Logo_Course} className='logo' alt='Course Logo'/>
      <div className='right-section'>
        <div className='links'>
          <Link to="/">Course</Link>
          <Link to="/cart"><ShoppingCart size={32} /></Link> 
          <img src={Profile_User} className='profile' alt='User Profile'/>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
