import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Components/HomePage';
import Login from './Components/LoginPage';
import SignUp from './Components/SignUpPage';
import Contact from './Components/Contact';
import StudentDashboard from './Components/Student/StudentDashboard';
import AdminDashboard from './Components/Admin/Admindashboard';
import Verify from './Components/Verify';
import StudentNotice from './Components/Student/StudentNotice';
import StudentResult from './Components/Student/StudentResult';
import StudentCourses from './Components/Student/Studentcourses';
import StudentSchedule from './Components/Student/StudentSchdule';
import './App.css';
import React, { useState, useEffect,useRef } from 'react';
import StudentAttendence from './Components/Student/StudentAttendence';
import { io } from 'socket.io-client';
import UploadAttendance from './Components/Staff/UploadAttendance';
import UploadMarks from './Components/Staff/UploadMarks';
import StaffDashboard from './Components/Staff/StaffDashboard';
import ProtectedRoute from './Components/Protected';
const App = () => {
  const [user, setUser] = useState({});
  const socketRef = useRef(null);
  

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server ', socketRef.current.id);
      
      
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from socket server');
    })


    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard user={user}/></ProtectedRoute>} />
        <Route path="/student/result" element={<ProtectedRoute><StudentResult /></ProtectedRoute>} />
        <Route path="/student/courses" element={<ProtectedRoute><StudentCourses /></ProtectedRoute>} />
        <Route path="/student/notice" element={<ProtectedRoute><StudentNotice /></ProtectedRoute>} />
        <Route path="/student/schdule" element={<ProtectedRoute><StudentSchedule /></ProtectedRoute>} />
        <Route path="/student/attendance" element={<ProtectedRoute><StudentAttendence  /></ProtectedRoute>} />
      
      <Route path="/staff/dashboard" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />
      <Route path="/staff/upload-attendance" element={<ProtectedRoute><UploadAttendance /></ProtectedRoute>} />
      <Route path="/staff/upload-marks" element={<ProtectedRoute><UploadMarks /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      
      <Route path="/verify" element={<Verify />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;