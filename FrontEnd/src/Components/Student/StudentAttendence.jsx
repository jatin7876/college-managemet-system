import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { io } from 'socket.io-client';

const StudentAttendance = () => {
  const [userinfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const socket = useMemo(() => io('http://localhost:3000'), []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (!storedUser) {
        console.log('No user found in localStorage, redirecting to login');
        navigate('/login');
        return;
      }

      setUserInfo(storedUser);

      // Handle socket connection errors
      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
        setError('Failed to connect to server');
        setIsLoading(false);
      });

      // Fetch courses
      socket.emit('getCourses', { email: storedUser.email });
      socket.on('coursesResponse', (data) => {
        console.log('Courses received:', data);
        if (data.success) {
          setCourses(data.courses || []);
        } else {
          setError(data.message || 'Failed to fetch courses');
        }
      });

      // Fetch attendance
      socket.emit('getAttendance', { email: storedUser.email });
      socket.on('attendanceResponse', (data) => {
        console.log('Attendance received:', userinfo);
        if (data.success) {
          // Handle nested attendance structure
          const attendanceData = Array.isArray(data.attendance?.attendance)
            ? data.attendance.attendance
            : Array.isArray(data.attendance)
            ? data.attendance
            : [];
          setAttendance(
            attendanceData.map((item) => ({
              date: item.date,
              status: item.status,
              courseCode: item.courseCode || 'N/A',
              _id: item._id || Math.random().toString(),
            }))
          );
        } else {
          setError(data.message || 'Failed to fetch attendance');
        }
        setIsLoading(false);
      });

      // Cleanup on unmount
      return () => {
        socket.off('coursesResponse');
        socket.off('attendanceResponse');
        socket.off('connect_error');
        socket.disconnect();
      };
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, socket]);

  // Log states for debugging
  useEffect(() => {
    console.log('Courses:', courses);
    console.log('Attendance:', attendance);
  }, [courses, attendance]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <FaGraduationCap className="text-5xl text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading your attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 p-6 ml-20">
        <h2 className="text-2xl font-bold text-teal-700 mb-6">Your Attendance</h2>
        <div className="bg-white p-6 rounded-xl shadow-md">
          {error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : courses.length > 0 && attendance.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-gray-700">Course Name</th>
                  <th className="py-2 text-gray-700">Course Code</th>
                  <th className="py-2 text-gray-700">Date</th>
                  <th className="py-2 text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => {
                  // Find the course matching the record's courseCode
                  const course = courses.find(
                    (c) => c.code.trim().toUpperCase() === record.courseCode.trim().toUpperCase()
                  ) || { name: 'BE', code: record.courseCode };
                  return (
                    <tr key={`${course.code}-${record._id}`} className="border-b">
                      <td className="py-2">{course.name}</td>
                      <td className="py-2">{course.code}</td>
                      <td className="py-2">{record.date}</td>
                      <td className="py-2">{record.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600">No attendance data found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;