import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Cla from '../assets/classroom.jpg';
import Lib from '../assets/library.jpg';
import Col from '../assets/college.jpg';
import User from '../assets/user.png';
import Girl from '../assets/girl.png';
import Boy from '../assets/boy.png';

const AnimatedText = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <h1 className="text-6xl font-extrabold text-gray-800 drop-shadow-md">
            {displayedText.split('').map((char, index) => (
                <span
                    key={index}
                    className="inline-block animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </h1>
    );
};

const FeatureCard = ({ title, description, icon }) => (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
        <span className="text-4xl text-teal-500 mb-4">{icon}</span>
        <h3 className="text-2xl font-semibold text-teal-700 mb-4 text-center">{title}</h3>
        <p className="text-gray-900 text-center">{description}</p>
    </div>
);

const ImageCard = ({ src, alt }) => (
    <img src={src} alt={alt} className="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300" />
);

const TestimonialCard = ({ quote, author, image }) => (
    <div className="bg-yellow-100 p-6 rounded-lg shadow-md flex items-center">
        <img src={image} alt={author} className="w-16 h-16 rounded-full mr-4" />
        <div>
            <p className="text-gray-900 italic">"{quote}"</p>
            <h4 className="mt-2 text-teal-500 font-semibold">- {author}</h4>
        </div>
    </div>
);

const Home = () => {
    return (
        <div className="min-h-screen bg-sky-500/30 flex flex-col">
            <Navbar />
            <header className="relative p-12 text-center bg-sky-500/30 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-sky-500/10" />
                <AnimatedText text="Welcome to Vidya" />
                <p className="mt-6 text-2xl text-black font-medium max-w-3xl mx-auto">
                    Empowering education with a seamless platform for students, faculty, and administrators.
                </p>
                <NavLink
                    to="/signup"
                    className="mt-8 inline-block px-8 py-4 bg-teal-500 text-white rounded-lg shadow-md font-semibold text-lg transition-all duration-300 hover:bg-teal-600 hover:shadow-lg"
                >
                    Get Started
                </NavLink>
            </header>

            {/* Features Section */}
            <section className="py-20 px-8 bg-gray-200">
                <h2 className="text-5xl font-bold text-teal-700 text-center mb-16">Key Features</h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <FeatureCard
                        title="Student Portal"
                        description="Access courses, grades, and attendance effortlessly."
                        icon="🎓"
                    />
                    <FeatureCard
                        title="Faculty Management"
                        description="Manage classes, grades, and reports with ease."
                        icon="🧑‍🏫"
                    />
                    <FeatureCard
                        title="Admin Dashboard"
                        description="Oversee data and maintain system integrity."
                        icon="⚙️"
                    />
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-20 px-8 bg-gray-200">
                <h2 className="text-5xl font-bold text-teal-700 text-center mb-16">Campus Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    <ImageCard src={Col} alt="College Campus" loading="lazy" />
                    <ImageCard src={Lib} alt="Library" loading="lazy" />
                    <ImageCard src={Cla} alt="Classroom" loading="lazy" />
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-8 bg-gray-200">
                <h2 className="text-5xl font-bold text-teal-700 text-center mb-16">What Our Users Say</h2>
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    <TestimonialCard
                        quote="This platform has revolutionized academic management!"
                        author="John Doe, Student"
                        image={User}
                    />
                    <TestimonialCard
                        quote="A seamless solution for faculty and administration."
                        author="Dr. Smith, Faculty"
                        image={User}
                    />
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 px-8 text-center bg-gray-200">
                <h2 className="text-4xl font-bold text-teal-700 mb-8">Ready to Transform Your College Management?</h2>
                <p className="text-xl text-gray-900 mb-12 max-w-3xl mx-auto">
                    Join thousands who trust us to manage their academic needs.
                </p>
                <NavLink
                    to="/signup"
                    className="inline-block px-10 py-5 bg-teal-500 text-white rounded-lg shadow-md font-semibold text-lg transition-all duration-300 hover:bg-teal-600 hover:shadow-lg"
                >
                    Sign Up Now
                </NavLink>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 px-8 bg-gray-200">
                <h2 className="text-5xl font-bold text-teal-700 text-center mb-16">Why Choose Us?</h2>
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-3xl font-semibold text-teal-700 mb-6">Seamless Integration</h3>
                        <p className="text-xl text-gray-900 mb-8">
                            Integrates smoothly with your existing infrastructure.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-teal-700 mb-6">Dedicated Support</h3>
                        <p className="text-xl text-gray-900 mb-8">
                            Support from setup to ongoing maintenance.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-teal-700 mb-6">Customizable Solutions</h3>
                        <p className="text-xl text-gray-900 mb-8">
                            Tailored to your institution’s unique needs.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-teal-700 mb-6">Secure and Reliable</h3>
                        <p className="text-xl text-gray-900 mb-8">
                            Your data is safe and always accessible.
                        </p>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="py-20 px-8 bg-gray-200">
                <h2 className="text-5xl font-bold text-teal-700 text-center mb-16">About Us</h2>
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xl text-gray-900 mb-8">
                        The College Management System simplifies academic administration and enhances education.
                    </p>
                    <p className="text-xl text-gray-900 mb-8">
                        We support students, faculty, and administrators with cutting-edge technology.
                    </p>
                    <p className="text-xl text-gray-900">
                        Our mission is to empower institutions in the digital age.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto text-center mt-12">
                    <h3 className="text-3xl font-semibold text-teal-700 mb-6">Our Team</h3>
                    <p className="text-xl text-gray-900 mb-8">
                        Passionate professionals dedicated to education and technology.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
                            <img src={Boy} alt="Team Member" className="w-24 h-24 rounded-full mb-4" />
                            <h4 className="text-2xl font-semibold text-teal-700 mb-2">Jatin</h4>
                            <p className="text-gray-900">CEO & Founder</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
                            <img src={Boy} alt="Team Member" className="w-24 h-24 rounded-full mb-4" />
                            <h4 className="text-2xl font-semibold text-teal-700 mb-2">Ankit</h4>
                            <p className="text-gray-900">CTO & Co-Founder</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
                            <img src={Boy} alt="Team Member" className="w-24 h-24 rounded-full mb-4" />
                            <h4 className="text-2xl font-semibold text-teal-700 mb-2">Kushagra</h4>
                            <p className="text-gray-900">CMO & Co-Founder</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
                            <img src={Girl} alt="Team Member" className="w-24 h-24 rounded-full mb-4" />
                            <h4 className="text-2xl font-semibold text-teal-700 mb-2">Niharika</h4>
                            <p className="text-gray-900">CMO & Co-Founder</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
                            <img src={Boy} alt="Team Member" className="w-24 h-24 rounded-full mb-4" />
                            <h4 className="text-2xl font-semibold text-teal-700 mb-2">Dhairya</h4>
                            <p className="text-gray-900">CTO & Co-Founder</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;