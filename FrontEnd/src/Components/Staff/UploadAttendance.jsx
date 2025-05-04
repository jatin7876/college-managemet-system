import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { io } from 'socket.io-client';
import axios from 'axios';
import User from '../../assets/user.png';

const UploadAttendance = () => {
  // Initialize Socket.IO client with useMemo
  const socket = useMemo(
    () =>
      io('https://sparkling-pamelina-jatin7876-c8ba21cb.koyeb.app', {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket', 'polling'],
      }),
    []
  );

  const [userinfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
 const [courses] = useState([
    { name: 'Introduction to Programming', code: 'CS101', credits: 4 },
    { name: 'Data Structures', code: 'CS201', credits: 3 },
    { name: 'Database Systems', code: 'CS301', credits: 3 },
    { name: 'Operating Systems', code: 'CS401', credits: 4 },
    { name: 'Web Development', code: 'CS501', credits: 3 },
  ]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    courseCode: '',
    date: '',
    records: [],
  });
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
         
          if (data.courses.length > 0) {
            setForm((prev) => ({ ...prev, courseCode: data.courses[0].code }));
          }
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
        socket.disconnect();
      };
    };

    fetchData();
  }, [navigate, socket]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!form.courseCode || !userinfo) return;
      try {
        const response = await axios.get(`http://localhost:3000/staff/get-students`, {
          params: { staffEmail: userinfo.email, courseCode: form.courseCode },
        });
        if (response.data.success) {
          const fetchedStudents = response.data.students || [];
          setStudents(fetchedStudents);
          setForm((prev) => ({
            ...prev,
            records: fetchedStudents.map((student) => ({
              studentEmail: student.email,
              status: 'P',
            })),
          }));
        } else {
          setError(response.data.message || 'Failed to fetch students');
        }
      } catch (err) {
        setError('Error fetching students: ' + err.message);
      }
    };

    fetchStudents();
  }, [form.courseCode, userinfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`http://localhost:3000/staff/upload-attendance`, {
        staffEmail: userinfo.email,
        courseCode: form.courseCode,
        date: form.date,
        attendanceRecords: form.records.map(record => ({
          studentEmail: record.studentEmail,
          status: record.status === 'P' ? 'Present' : 'Absent'
        })),
      });
      if (response.data.success) {
        setSuccess('Attendance uploaded successfully');
        setForm((prev) => ({
          ...prev,
          date: '',
          records: students.map((student) => ({
            studentEmail: student.email,
            status: 'P',
          })),
        }));
      } else {
        setError(response.data.message || 'Failed to upload attendance');
      }
    } catch (err) {
      setError('Error uploading attendance: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-gray-100">
        <div className="text-center">
          <FaGraduationCap className="text-6xl text-teal-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 p-8 ml-90">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-teal-700">Upload Attendance</h2>
          {userinfo && (
            <div className="">
              <img src={User} alt="" className='w-20 rounded-full border-2 border-teal-600'/>
              <p className="text-lg font-semibold text-gray-800">{userinfo.name}</p>
              <p className="text-sm text-gray-600">{userinfo.email}</p>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          {error && (
            <p className="text-red-600 text-center mb-6 font-medium">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-center mb-6 font-medium">{success}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <select
                value={form.courseCode}
                onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.code} value={course.code}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3"
                required
              />
            </div>
            {students.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Students</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-teal-50">
                        <th className="py-3 px-4 text-gray-700 font-semibold">Student Email</th>
                        <th className="py-3 px-4 text-gray-700 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr key={student.email} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{student.email}</td>
                          <td className="py-3 px-4">
                            <select
                              value={form.records[index]?.status || 'P'}
                              onChange={(e) => {
                                const newRecords = [...form.records];
                                newRecords[index] = {
                                  studentEmail: student.email,
                                  status: e.target.value,
                                };
                                setForm({ ...form, records: newRecords });
                              }}
                              className="rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-1 px-2"
                            >
                              <option value="P">P (Present)</option>
                              <option value="A">A (Absent)</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="px-6 py-3 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!form.courseCode || !form.date || students.length === 0}
            >
              Submit Attendance
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadAttendance;