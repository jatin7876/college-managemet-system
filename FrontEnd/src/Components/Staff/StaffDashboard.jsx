import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import User from '../../assets/user.png';
import { io } from 'socket.io-client';

const StaffDashboard = () => {
  const socket = useMemo(() => io('http://localhost:3000'), []);
  const [userinfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (!storedUser || storedUser.role !== 'staff') {
        console.log('No staff user found, redirecting to login');
        navigate('/login');
        return;
      }

      setUserInfo(storedUser);

      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
        setError('Failed to connect to server. Retrying...');
      });

      socket.on('reconnect', (attempt) => {
        console.log(`Reconnected after ${attempt} attempts`);
        setError(null);
        socket.emit('getCourses', { email: storedUser.email });
      });

      socket.on('reconnect_failed', () => {
        console.error('Reconnection failed');
        setError('Failed to reconnect to server. Please try again later.');
        setIsLoading(false);
      });

      socket.emit('getCourses', { email: storedUser.email });
      socket.on('coursesResponse', (data) => {
        console.log('Courses received:', data);
        if (data.success) {
          setCourses(data.courses);
        } else {
          setError(data.message || 'Failed to fetch courses');
        }
        setIsLoading(false);
      });

      return () => {
        socket.off('coursesResponse');
        socket.off('connect_error');
        socket.off('reconnect');
        socket.off('reconnect_failed');
      };
    };

    fetchData();
  }, [navigate, socket]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <FaGraduationCap className="text-6xl text-teal-600 animate-pulse mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading Staff Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 p-8 ml-90">
        {/* Header with Staff Info */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h2 className="text-3xl font-bold text-teal-700">Staff Dashboard</h2>
          {userinfo && (
            <div className="">
              <img src={User} alt=""  className='w-20  rounded-full border-2 border-teal-600'/>
              <p className="text-lg font-semibold text-gray-800">{userinfo.name}</p>
              <p className="text-sm text-gray-600">{userinfo.email}</p>
            </div>
          )}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-2xl shadow-lg"
        >
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-600 text-center mb-6 font-medium"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <h3 className="text-xl font-semibold text-gray-700 mb-6">Courses You Teach</h3>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <motion.div
                  key={course.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-r from-teal-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <h4 className="text-lg font-medium text-teal-600 mb-2">{course.name}</h4>
                  <p className="text-sm text-gray-600">Code: {course.code}</p>
                  <p className="text-sm text-gray-600">Credits: {course.credits}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-600 text-lg"
            >
              No courses assigned
            </motion.p>
          )}

          <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-6">Quick Actions</h3>
          <div className="flex space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/staff/upload-attendance')}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition-colors"
            >
              Upload Attendance
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/staff/upload-marks')}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition-colors"
            >
              Upload Marks
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffDashboard;