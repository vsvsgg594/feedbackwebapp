import React from "react";
import { useNavigate } from "react-router";

const Home = () => {
    const navigate = useNavigate();

    const goToLoginPage = () => {
        // Try to read stored user from localStorage
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            // If user exists and role is admin, send to admin-login
            if (storedUser && storedUser.role === 'admin') {
                navigate('/admin-login');
                return;
            }
        } catch (e) {
            console.warn('No valid user in localStorage, defaulting to client login');
        }
        // Default: client login
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4">
            <div className="max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl p-10 text-center shadow-2xl">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
                    Welcome to Feedbackify 💬
                </h1>
                <p className="text-lg sm:text-xl mb-6">
                    We value your thoughts! Help us improve by sharing your experience.
                </p>
                <button
                    onClick={goToLoginPage}
                    className="mt-4 bg-white text-indigo-600 font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
                >
                    Leave Feedback
n                </button>
            </div>
        </div>
    );
};

export default Home;
