import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import Navbar from './Navbar';
import LoginImage from '../assets/login.png';


const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      console.log('Sending login request:', { email, password });
      const response = await axios.post('/login', {
        email,
        password,
      });
      console.log('Login response:', response.data);
      if (response.data.success) {
        setUser(response.data.user);
        console.log('User role:', response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if(response.data.user.role=='Admin')
        {
          sessionStorage.setItem('isLoggedIn', 'true');
          navigate('/admin')
        
        }
        else
        { sessionStorage.setItem('isLoggedIn', 'true');
        navigate(response.data.user.role === 'staff' ? '/staff/dashboard' : '/student/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
            <h2 className="text-center text-3xl font-extrabold text-gray-800">Login</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <input
                  placeholder="john@chitkarauniversity.edu.in"
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-0 top-3 text-gray-500 hover:text-teal-500 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
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
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <NavLink to="/signup" className="text-teal-500 hover:text-teal-600 transition-colors">
                Sign up
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;