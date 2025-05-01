import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaChartBar, FaBell } from 'react-icons/fa';
import User from '../../assets/user.png'; // Placeholder for user image
import axios from 'axios';
import Sidebar from './Sidebar';

const StudentDashboard = () => {
  const [userinfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewStudent, setIsNewStudent] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    course: '',
    semester: '',
    year: '',
    department: '',
    rollNumber: '',
  });
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    setIsLoading(true);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserInfo(storedUser);
      if (!storedUser.course || !storedUser.semester || !storedUser.year) {
        setIsNewStudent(true);
      }
    } else {
      navigate('/login');
    }
    setIsLoading(false);
  }, [navigate]);



  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course || !formData.semester || !formData.year || !formData.department || !formData.rollNumber) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.put('/student/update-profile', {
        email: userinfo.email,
        ...formData,
      });
      const updatedUser = response.data.user;
      setUserInfo(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsNewStudent(false);
      setIsFormOpen(false);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const openFormModal = () => {
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setFormError('');
  };

  if (isLoading || !userinfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <FaGraduationCap className="text-5xl text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-300 font-sans text-gray-800">
      <Sidebar  />
      <div className="flex-1 p-6 ml-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="bg-teal-50 text-teal-700 p-6 rounded-xl shadow-lg w-full md:w-auto">
            <p className="text-sm text-teal-600">{currentDate}</p>
            <h2 className="text-2xl font-bold">Welcome back, {userinfo.name || 'User'}</h2>
            <p className="text-sm text-teal-600">Stay updated in your student portal</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <img src={User} alt="User profile" className="w-16 h-16 rounded-full border-2 border-teal-600" />
              <p className="font-semibold text-teal-700 mt-2">{userinfo.name || 'N/A'}</p>
              <p className="text-sm text-teal-600">{userinfo.email || 'N/A'}</p>
            </div>
          </div>
        </div>

        {isNewStudent && (
          <div className="mb-6">
            <button
              onClick={openFormModal}
              className="bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center"
              aria-label="Fill the Undertaking Form"
            >
              <FaGraduationCap className="mr-2" />
              Fill the Undertaking Form
            </button>
          </div>
        )}

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-teal-700">Undertaking Form</h2>
                <button
                  onClick={closeFormModal}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close form"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">Please provide your academic details.</p>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleFormChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., B.Tech"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleFormChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleFormChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., 2025"
                    min="2000"
                    max="2030"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleFormChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., CS2023001"
                    required
                  />
                </div>
                {formError && <p className="text-red-500 text-sm">{formError}</p>}
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Courses Enrolled', value: userinfo.course ? '1' : '0', icon: FaGraduationCap, color: 'teal' },
            { title: 'Upcoming Classes', value: '3', icon: FaChartBar, color: 'blue' },
            { title: 'Notices', value: '2', icon: FaBell, color: 'yellow' },
          ].map((card) => (
            <div
              key={card.title}
              className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-${card.color}-500`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <card.icon className={`text-3xl text-${card.color}-500`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;