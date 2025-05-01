import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Verify = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tempData = JSON.parse(localStorage.getItem('tempData'));
      const tempCode = localStorage.getItem('tempCode');

      console.log('Sending verify request:', { ...tempData, code: tempCode, receivedCode: verificationCode });
      const response = await axios.post('http://localhost:3000/verify', {
        ...tempData,
        code: tempCode,
        receivedCode: verificationCode,
      });

      if (response.data.verified) {
        // Set user after successful verification
        localStorage.removeItem('tempCode'); // Cleanup
        localStorage.removeItem('tempData');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 space-y-6 border border-gray-200">
        <h2 className="text-center text-3xl font-extrabold text-gray-800">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-600">Enter the verification code sent to your email </p>
        <span className='text-red-400'>Aslo Check the spam email</span>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="relative">
            <input
              placeholder="123456"
              className="peer h-12 w-full border-b-2 border-gray-300 text-gray-800 bg-transparent placeholder-transparent focus:outline-none focus:border-teal-500 transition-colors duration-300"
              required
              id="verificationCode"
              name="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <label
              className="absolute left-0 -top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-teal-500 peer-focus:text-sm"
              htmlFor="verificationCode"
            >
              Verification Code
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-teal-500 text-white rounded-lg shadow-md font-semibold transition-all duration-300 hover:bg-teal-600 hover:shadow-lg disabled:bg-teal-300"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;