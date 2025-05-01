import React from 'react';
import { FaInstagramSquare } from 'react-icons/fa';
import { CiLinkedin } from 'react-icons/ci';
import { BsTwitter } from 'react-icons/bs';
import IM from '../assets/foo.png';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className=" bg-sky-500/20  text-black ">
      <div className=" mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
         
          <img src={IM} alt="Footer Image" className="w-full  m-4  " />
        </div>
        <div className='ml-20 mt-10'>
          <h3 className="text-2xl font-semibold mb-6">Quick Links</h3>
          <ul>
            <li className="mb-4">
              <NavLink to="/signup" className="text-lg hover:text-gray-200 transition-colors duration-300">
                Sign Up
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink to="/login" className="text-lg hover:text-gray-200 transition-colors duration-300">
                Log In
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink to="/about" className="text-lg hover:text-gray-200 transition-colors duration-300">
                About Us
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink to="/contact" className="text-lg hover:text-gray-200 transition-colors duration-300">
                Contact Us
              </NavLink>
            </li>
          </ul>
        </div>
        <div className='mt-10'>
          <h3 className="text-2xl font-semibold mb-6 ">Support</h3>
          <ul>
            <li className="mb-4">
              <a href="mailto:support@vidya.com" className="text-lg hover:text-gray-200 transition-colors duration-300">
                support@vidya.com
              </a>
            </li>
            <li className="mb-4">
              <a href="tel:+1234567890" className="text-lg hover:text-gray-200 transition-colors duration-300">
                +1 (234) 567-8900
              </a>
            </li>
           
          </ul>
        </div>
        <div className='mt-10'>
          <h3 className="text-2xl font-semibold mb-6">Social Media</h3>
          <ul>
            <li className="mb-4 flex items-center">
              <a href="https://www.facebook.com/" className="text-lg hover:text-gray-200 transition-colors duration-300">
                <FaInstagramSquare size={24} className="mr-2" />
                Facebook
              </a>
            </li>
            <li className="mb-4 flex items-center">
              <a href="https://www.twitter.com/" className="text-lg hover:text-gray-200 transition-colors duration-300">
                <BsTwitter size={24} className="mr-2" />
                Twitter
              </a>
            </li>
            <li className="mb-4 flex items-center">
              <a href="https://www.instagram.com/" className="text-lg hover:text-gray-200 transition-colors duration-300">
                <FaInstagramSquare size={24} className="mr-2" />
                Instagram
              </a>
            </li>
            <li className="mb-4 flex items-center">
              <a href="https://www.linkedin.com/" className="text-lg hover:text-gray-200 transition-colors duration-300">
                <CiLinkedin size={24} className="mr-2" />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto text-center mt-12">
        <p>&copy; 2023 Vidya. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
