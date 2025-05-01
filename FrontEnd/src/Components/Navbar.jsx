import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar() {

  

  return (
    <div className="flex  justify-between items-center h-16 bg-sky-500/30  font-sans sticky top-0 z-50">
      <div className="pl-8">
        <img src={logo} alt="Vidya Logo" className="w-50 h-15" />
      </div>
      <div className="pr-12 w-full">
        <div className="flex justify-end gap-6">
          
          <NavLink to="/" className={({ isActive }) => `${isActive ? 'text-teal-500' : 'text-gray-800'}`}>
            <button className="hover:cursor-pointer group/button relative inline-flex items-center justify-center overflow-hidden rounded-md px-6 py-2 text-base font-semibold transition-all duration-300 ease-in-out hover:bg-teal-500 hover:text-white hover:shadow-lg">
              <span className="text-xl">Home</span>
              <div className="absolute inset-0 flex h-full w-full justify-center transform skew-x-[-13deg] -translate-x-full group-hover/button:duration-1000 group-hover/button:translate-x-full">
                <div className="relative h-full w-10 bg-teal-200/50"></div>
              </div>
            </button>
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `${isActive ? 'text-teal-500' : 'text-gray-800'}`}>
            <button className="hover:cursor-pointer group/button relative inline-flex items-center justify-center overflow-hidden rounded-md px-6 py-2 text-base font-semibold transition-all duration-300 ease-in-out hover:bg-teal-500 hover:text-white hover:shadow-lg">
              <span className="text-xl">Contact</span>
              <div className="absolute inset-0 flex h-full w-full justify-center transform skew-x-[-13deg] -translate-x-full group-hover/button:duration-1000 group-hover/button:translate-x-full">
                <div className="relative h-full w-10 bg-teal-200/50"></div>
              </div>
            </button>
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => `${isActive ? 'text-teal-500' : 'text-gray-800'}`}>
            <button className="hover:cursor-pointer group/button relative inline-flex items-center justify-center overflow-hidden rounded-md px-6 py-2 text-base font-semibold transition-all duration-300 ease-in-out hover:bg-teal-500 hover:text-white hover:shadow-xl">
              <span className="text-xl">Login</span>
              <div className="absolute inset-0 flex h-full w-full justify-center transform skew-x-[-13deg] -translate-x-full group-hover/button:duration-1000 group-hover/button:translate-x-full">
                <div className="relative h-full w-10 bg-teal-200/50"></div>
              </div>
            </button>
          </NavLink>
          <NavLink to="/signup" className={({ isActive }) => `${isActive ? 'text-teal-500' : 'text-gray-800'}`}>
            <button className="hover:cursor-pointer group/button relative inline-flex items-center justify-center overflow-hidden rounded-md px-6 py-2 text-base font-semibold transition-all duration-300 ease-in-out hover:bg-teal-500 hover:text-white hover:shadow-xl">
              <span className="text-xl">Signup</span>
              <div className="absolute inset-0 flex h-full w-full justify-center transform skew-x-[-13deg] -translate-x-full group-hover/button:duration-1000 group-hover/button:translate-x-full">
                <div className="relative h-full w-10 bg-teal-200/50"></div>
              </div>
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
