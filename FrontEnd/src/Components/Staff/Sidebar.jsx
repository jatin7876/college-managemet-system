import React, { } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaGraduationCap } from 'react-icons/fa';

const Sidebar = () => {


  return (
    <div className={`fixed top-0 left-0 h-full bg-teal-600 text-white transition-all duration-300  w-80`}>
      <div className="flex items-center justify-between p-4">
        <FaGraduationCap className={`text-3xl`} />
        <button  className="text-white focus:outline-none">
          
        </button>
      </div>
      <nav className="mt-4">
        <NavLink
          to="/staff/dashboard"
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-teal-700 transition-colors ${isActive ? 'bg-teal-700' : ''}`
          }
        >
          <span className="text-xl mr-4">🏠</span>
          <span >Dashboard</span>
        </NavLink>
        <NavLink
          to="/staff/upload-attendance"
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-teal-700 transition-colors ${isActive ? 'bg-teal-700' : ''}`
          }
        >
          <span className="text-xl mr-4">📅</span>
          <span >Upload Attendance</span>
        </NavLink>
        <NavLink
          to="/staff/upload-marks"
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-teal-700 transition-colors ${isActive ? 'bg-teal-700' : ''}`
          }
        >
          <span className="text-xl mr-4">📊</span>
          <span >Upload Marks</span>
        </NavLink>
        <NavLink
          to="/login" 
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-teal-700 transition-colors ${isActive ? 'bg-teal-700' : ''}`
          }
        >
          <span className="text-xl mr-4">🚪</span>
          <button onClick={()=>sessionStorage.clear()}>Logout</button>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;