import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
   const navigate=useNavigate()
   const baseurl=import.meta.env.VITE_API_BASE_URL

  const goToLog=()=>{
    navigate("/login")


  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${baseurl}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess('Registered successfully!');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Create Your Account ✨</h2>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Your full name"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Create a password"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-white text-indigo-600 font-semibold rounded-full shadow-md hover:scale-105 transition-transform duration-300"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-white/80">Already have an account? <span className="underline cursor-pointer hover:text-white" onClick={goToLog}>Login</span></p>
      </div>
    </div>
  );
};

export default Register;
