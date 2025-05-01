import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaChartBar, FaBell, FaSignOutAlt, FaBars } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <>
      <div
        className={`bg-teal-500 text-white p-10  w-90 flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center mb-8">
            <FaGraduationCap className="text-3xl mr-2" />
            <h1 className="text-xl font-bold">Student Portal</h1>
          </div>
          <nav>
            <ul className="space-y-2">
              {[
                { to: '/student/dashboard', icon: FaGraduationCap, label: 'Dashboard' },
                { to: '/student/courses', icon: FaChartBar, label: 'Courses' },
                { to: '/student/result', icon: FaChartBar, label: 'Result' },
                { to: '/student/notice', icon: FaBell, label: 'Notices' },
                { to: '/student/attendance', icon: FaChartBar, label: 'Attendance' },
                { to: '/student/schdule', icon: FaChartBar, label: 'Schedule' },
              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                        isActive ? 'bg-teal-700 text-white' : 'hover:bg-teal-500'
                      }`
                    }
                    aria-label={item.label}
                  >
                    <item.icon className="mr-3 text-lg" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-colors duration-200 hover:cursor"
          aria-label="Logout"
        >
          <FaSignOutAlt className="mr-3" />
          Logout
        </button>
      </div>
      <button
        className="md:hidden p-2 bg-teal-600 text-white rounded-lg fixed top-4 left-4 z-50"
        aria-label="Toggle Sidebar"
      >
        <FaBars />
      </button>
    </>
  );
};

export default Sidebar;