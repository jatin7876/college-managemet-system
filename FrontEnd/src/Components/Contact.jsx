import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../App.css';
import Navbar from './Navbar';
const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset form after 2 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      e.target.reset();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar/>
      <div className="flex-grow flex justify-center items-center py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-md p-8 space-y-6 border border-gray-200 relative">
          <h2 className="text-3xl font-extrabold text-gray-800 text-center">
            Contact Us
          </h2>
          <p className="text-gray-600 text-center">
            We’d love to hear from you! Reach out with any questions or feedback.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                placeholder="Your Name"
                className="peer h-12 w-full border-b-2 border-gray-300 text-gray-800 bg-transparent placeholder-transparent focus:outline-none focus:border-teal-500 transition-colors duration-300"
                required
                id="name"
                name="name"
                type="text"
              />
              <label
                className="absolute left-0 -top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-teal-500 peer-focus:text-sm"
                htmlFor="name"
              >
                Name
              </label>
            </div>
            <div className="relative">
              <input
                placeholder="your@email.com"
                className="peer h-12 w-full border-b-2 border-gray-300 text-gray-800 bg-transparent placeholder-transparent focus:outline-none focus:border-teal-500 transition-colors duration-300"
                required
                id="email"
                name="email"
                type="email"
              />
              <label
                className="absolute left-0 -top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-teal-500 peer-focus:text-sm"
                htmlFor="email"
              >
                Email
              </label>
            </div>
            <div className="relative">
              <textarea
                placeholder="Your Message"
                className="peer w-full h-32 border-2 border-gray-300 text-gray-800 bg-transparent placeholder-transparent focus:outline-none focus:border-teal-500 transition-colors duration-300 rounded-md p-2"
                required
                id="message"
                name="message"
              />
              <label
                className="absolute left-2 -top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-teal-500 peer-focus:text-sm"
                htmlFor="message"
              >
                Message
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-teal-500 text-white rounded-lg shadow-md font-semibold transition-all duration-300 hover:bg-teal-600 hover:shadow-lg relative overflow-hidden"
            >
              <span className="relative z-10">Send Message</span>
            </button>
          </form>

          {/* Success Animation Overlay */}
          <div
            className={`absolute inset-0 bg-teal-500 flex items-center justify-center transition-all duration-500 ${
              isSubmitted
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="text-white text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-xl font-semibold">Message Sent!</p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Back to{' '}
            <NavLink to="/" className="text-teal-500 hover:text-teal-600 transition-colors">
              Home
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;