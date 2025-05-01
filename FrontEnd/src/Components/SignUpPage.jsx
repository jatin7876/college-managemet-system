import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../App.css';
import Navbar from './Navbar';
import LoginImage from '../assets/login.png';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(''); // Added name field
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Sending signup request:', { name, email, password });
      const response = await axios.post('/register', {
        name,
        email,
        password,
      });

      if (response.data.success) {
        // Store temp data and code for verification step
        localStorage.setItem('tempCode', response.data.tempCode);
        localStorage.setItem('tempData', JSON.stringify(response.data.tempData));
        // Optionally set user state if needed immediately
       
        navigate('/verify'); // Redirect to verification page
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <Navbar />
      <div className="flex flex-rows justify-items-center">
        <div className="pl-10">
          <img src={LoginImage} alt="LoginImage" className="w-157" />
        </div>
        <div className="flex justify-center items-center flex-grow py-12">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 space-y-6 border border-gray-200">
            <h2 className="text-center text-3xl font-extrabold text-gray-800">
              Sign Up
            </h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="relative">
                <input
                  placeholder="John Doe"
                  className="peer h-12 w-full border-b-2 border-gray-300 text-gray-800 bg-transparent placeholder-transparent focus:outline-none focus:border-teal-500 transition-colors duration-300"
                  required
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label
                  className="absolute left-0 -top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-teal-500 peer-focus:text-sm"
                  htmlFor="name"
                >
                  Full Name
                </label>
              </div>
              <div className="relative">
                <input
                  placeholder="john@example.com"
                  className="peer h-12 w-full border-b-2 border-gray-300 text-gray-800 bg-transparent placeholder-transparent focus:outline-none focus:border-teal-500 transition-colors duration-300"
                  required
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  className="absolute left-0 -top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-teal-500 peer-focus:text-sm"
                  htmlFor="email"
                >
                  Email address
                </label>
              </div>
              <div className="relative">
                <input
                  placeholder="Password"
                  className="peer h-12 w-full border-b-2 border-gray-300 text-gray-800 bg-transparent placeholder-transparent focus:outline-none focus:border-teal-500 transition-colors duration-300"
                  required
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  className="absolute left-0 -top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-teal-500 peer-focus:text-sm"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    className="h-5 w-5 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                    type="checkbox"
                  />
                 
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-teal-500 text-white rounded-lg shadow-md font-semibold transition-all duration-300 hover:bg-teal-600 hover:shadow-lg disabled:bg-teal-300"
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <NavLink to="/login" className="text-teal-500 hover:text-teal-600 transition-colors">
                Sign in
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;