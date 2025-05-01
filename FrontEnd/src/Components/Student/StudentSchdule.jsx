import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import axios from 'axios';
import Sidebar from './Sidebar';

const StudentSchdule = () => {
  const [userinfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserInfo(storedUser);
      fetchSchedule(storedUser.email);
    } else {
      navigate('/login');
    }
    setIsLoading(false);
  }, [navigate]);

  const fetchSchedule = async (email) => {
    try {
      // Placeholder API call
      const response = await axios.get('/student/schdule', {
        params: { email },
      });
      setSchedule(response.data.schedule || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      // Mock data
      setSchedule([
        { day: 'Monday', time: '10:00 AM', course: 'Mathematics', room: 'A-101' },
        { day: 'Tuesday', time: '2:00 PM', course: 'Physics', room: 'B-202' },
      ]);
    }
  };



  if (isLoading || !userinfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <FaGraduationCap className="text-5xl text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-800">
      <Sidebar  />
      <div className="flex-1 p-6 ml-20">
        <h2 className="text-2xl font-bold text-teal-700 mb-6">Your Schedule</h2>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-gray-700">Day</th>
                <th className="py-2 text-gray-700">Time</th>
                <th className="py-2 text-gray-700">Course</th>
                <th className="py-2 text-gray-700">Room</th>
              </tr>
            </thead>
            <tbody>
              {schedule.length > 0 ? (
                schedule.map((slot, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{slot.day}</td>
                    <td className="py-2">{slot.time}</td>
                    <td className="py-2">{slot.course}</td>
                    <td className="py-2">{slot.room}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-2 text-center text-gray-600">
                    No schedule available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentSchdule;