import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import axios from 'axios';
import Sidebar from './Sidebar';

const StudentNotice = () => {
  const [userinfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserInfo(storedUser);
      fetchNotices(storedUser.email);
    } else {
      navigate('/login');
    }
    setIsLoading(false);
  }, [navigate]);

  const fetchNotices = async (email) => {
    try {
      // Placeholder API call (replace with actual endpoint when implemented)
      const response = await axios.get('/student/notice', {
        params: { email },
      });
      setNotices(response.data.notices || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
      // Mock data for now
      setNotices([
        {
          title: 'Exam Schedule Released',
          date: '2025-04-15',
          description: 'Mid-term exams for Semester 3 start on May 1, 2025.',
        },
        {
          title: 'Campus Event',
          date: '2025-04-10',
          description: 'Join the Tech Fest on April 20, 2025, at the Main Auditorium.',
        },
      ]);
    }
  };


  if (isLoading || !userinfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <FaGraduationCap className="text-5xl text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading your notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-800">
      <Sidebar  />
      <div className="flex-1 p-6 ml-20">
        <h2 className="text-2xl font-bold text-teal-700 mb-6">Notices</h2>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-gray-700">Title</th>
                <th className="py-2 text-gray-700">Date</th>
                <th className="py-2 text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody>
              {notices.length > 0 ? (
                notices.map((notice, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{notice.title}</td>
                    <td className="py-2">{notice.date}</td>
                    <td className="py-2">{notice.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-2 text-center text-gray-600">
                    No notices available
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

export default StudentNotice;