import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('https://sparkling-pamelina-jatin7876-c8ba21cb.koyeb.app', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'],
});

const UploadMarks = () => {
  const [userinfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const courses = [
     
    { name: 'Introduction to Programming', code: 'CS101', credits: 4 },
    { name: 'Data Structures', code: 'CS201', credits: 3 },
    { name: 'Database Systems', code: 'CS301', credits: 3 },
    { name: 'Operating Systems', code: 'CS401', credits: 4 },
    { name: 'Web Development', code: 'CS501', credits: 3 }

];
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    courseCode: '',
    assessmentType: 'Quiz',
    date: '',
    records: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let storedUser;
      try {
        storedUser = JSON.parse(localStorage.getItem('user'));
      } catch (err) {
        console.error('Invalid user data in localStorage:', err);
        navigate('/login');
        return;
      }

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

      socket.on('coursesResponse', (data) => {
        console.log('Courses response:', data);
        if (data.success) {
          console.log('Courses received:', data.courses);
        } else {
          setError(data.message || 'Failed to fetch courses');
        }
        setIsLoading(false);
      });

      console.log('Emitting getCourses for email:', storedUser.email);
      socket.emit('getCourses', { email: storedUser.email });

      return () => {
        socket.off('coursesResponse');
        socket.off('connect_error');
        socket.off('reconnect');
        socket.off('reconnect_failed');
      };
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!userinfo || !form.courseCode) return;
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/staff/get-students`, {
          params: { staffEmail: userinfo.email, courseCode: form.courseCode },
        });
        console.log('Students response:', response.data);
        if (response.data.success) {
          setStudents(response.data.students || []);
          setForm((prev) => ({
            ...prev,
            records: (response.data.students || []).map((student) => ({
              studentEmail: student.email,
              score: 0,
              maxScore: 100,
            })),
          }));
        } else {
          setError(response.data.message || 'Failed to fetch students');
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Error fetching students: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [form.courseCode, userinfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.courseCode || !form.date || form.records.length === 0) {
      setError('Please fill all required fields (course, date, and student marks).');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/staff/upload-marks`, {
        staffEmail: userinfo.email,
        courseCode: form.courseCode,
        assessmentType: form.assessmentType,
        date: form.date,
        marksRecords: form.records,
      });
      console.log('Upload marks response:', response.data);
      if (response.data.success) {
        setSuccess('Marks uploaded successfully');
        setForm((prev) => ({
          ...prev,
          date: '',
          records: students.map((student) => ({
            studentEmail: student.email,
            score: 0,
            maxScore: 100,
          })),
        }));
      } else {
        setError(response.data.message || 'Failed to upload marks');
      }
    } catch (err) {
      console.error('Submission error:', err.response?.data || err.message);
      setError('Error uploading marks: ' + (err.response?.data?.message || err.message));
    }
  };

  console.log('Current courses state:', courses); // Debug courses state

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <FaGraduationCap className="text-5xl text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 p-6 ml-90">
        <h2 className="text-2xl font-bold text-teal-700 mb-6 animate-fadeIn">Upload Marks</h2>
        <div className="bg-white p-6 rounded-xl shadow-md">
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {success && <p className="text-green-600 text-center mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <select
                value={form.courseCode}
                onChange={(e) => setForm((prev) => ({ ...prev, courseCode: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
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
              <label className="block text-sm font-medium text-gray-700">Assessment Type</label>
              <select
                value={form.assessmentType}
                onChange={(e) => setForm((prev) => ({ ...prev, assessmentType: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              >
                <option value="Quiz">Quiz</option>
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
                <option value="Assignment">Assignment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>
            {students.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Students</h3>
                <table className="w-full text-left mt-2">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-gray-700">Student Email</th>
                      <th className="py-2 text-gray-700">Score</th>
                      <th className="py-2 text-gray-700">Max Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.email} className="border-b">
                        <td className="py-2">{student.email}</td>
                        <td className="py-2">
                          <input
                            type="number"
                            value={form.records[index]?.score || 0}
                            onChange={(e) => {
                              const newRecords = [...form.records];
                              newRecords[index] = {
                                studentEmail: student.email,
                                score: parseInt(e.target.value) || 0,
                                maxScore: form.records[index]?.maxScore || 100,
                              };
                              setForm((prev) => ({ ...prev, records: newRecords }));
                            }}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            min="0"
                            required
                          />
                        </td>
                        <td className="py-2">
                          <input
                            type="number"
                            value={form.records[index]?.maxScore || 100}
                            onChange={(e) => {
                              const newRecords = [...form.records];
                              newRecords[index] = {
                                studentEmail: student.email,
                                score: form.records[index]?.score || 0,
                                maxScore: parseInt(e.target.value) || 100,
                              };
                              setForm((prev) => ({ ...prev, records: newRecords }));
                            }}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            min="1"
                            required
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
              disabled={!form.courseCode || !form.date || students.length === 0}
            >
              Submit Marks
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadMarks;