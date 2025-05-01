import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import axios from 'axios';
import Sidebar from './Sidebar';

const StudentResult = () => {
    const [userinfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            let storedUser;
            try {
                storedUser = JSON.parse(localStorage.getItem('user'));
            } catch (err) {
                console.error('Invalid user data in localStorage:', err);
                setError('Invalid user data. Please log in again.');
                navigate('/login');
                return;
            }

            if (!storedUser || storedUser.role !== 'student') {
                console.log('No student user found, redirecting to login');
                setError('Access restricted to students only.');
                navigate('/login');
                return;
            }

            setUserInfo(storedUser);
            await fetchResults(storedUser.email);
            setIsLoading(false);
        };

        fetchData();
    }, [navigate]);

    const fetchResults = async (email) => {
        try {
            const response = await axios.get('http://localhost:3000/student/result', {
                params: { email },
            });
            console.log('Results response:', response.data);
            if (response.data.success) {
                setResults(response.data.results || []);
                setError(null);
            } else {
                setError(response.data.message || 'Failed to fetch results');
            }
        } catch (error) {
            console.error('Error fetching results:', error);
            setError('Error fetching results: ' + (error.response?.data?.message || error.message));
        }
    };

    if (isLoading || !userinfo) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <FaGraduationCap className="text-5xl text-teal-600 animate-spin mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-700">Loading your results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans text-gray-800">
            <Sidebar />
            <div className="flex-1 p-6 ml-20">
                <h2 className="text-2xl font-bold text-teal-700 mb-6">Your Results</h2>
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                        {error}
                    </div>
                )}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 text-gray-700">Course</th>
                                <th className="py-2 text-gray-700">Semester</th>
                                <th className="py-2 text-gray-700">Grade</th>
                                <th className="py-2 text-gray-700">Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.length > 0 ? (
                                results.map((result, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-2">{result.course}</td>
                                        <td className="py-2">{result.semester}</td>
                                        <td className="py-2">{result.grade}</td>
                                        <td className="py-2">{result.year}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-2 text-center text-gray-600">
                                        No results available
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

export default StudentResult;