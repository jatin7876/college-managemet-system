import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import Sidebar from './Sidebar';

const StudentCourses = () => {
  const [userinfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courses] = useState([
    { name: 'Introduction to Programming', code: 'CS101', credits: 4 },
    { name: 'Data Structures', code: 'CS201', credits: 3 },
    { name: 'Database Systems', code: 'CS301', credits: 3 },
    { name: 'Operating Systems', code: 'CS401', credits: 4 },
    { name: 'Web Development', code: 'CS501', credits: 3 },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserInfo(storedUser);
      setIsLoading(false);
    } else {
      navigate('/login');
    }
  }, [navigate]);

 

  if (isLoading || !userinfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <FaGraduationCap className="text-5xl text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-800">
      <Sidebar />
      <div className={`flex-1 p-6 ml-20`}>
        <h2 className="text-2xl font-bold text-teal-700 mb-6">Your Courses</h2>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-gray-700">Course Name</th>
                <th className="py-2 text-gray-700">Course Code</th>
                <th className="py-2 text-gray-700">Credits</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{course.name}</td>
                    <td className="py-2">{course.code}</td>
                    <td className="py-2">{course.credits}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-2 text-center text-gray-600">
                    No courses enrolled
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

export default StudentCourses;