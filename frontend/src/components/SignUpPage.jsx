import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('All fields are required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      await axios.post('/api/users/signup', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen bg-[#F1EFE1] flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 sm:py-16">
        <div className="w-full max-w-md text-center px-4 sm:px-6">
          <h1 className="text-[#3F48CC] text-4xl sm:text-5xl font-extrabold mb-12 sm:mb-16 whitespace-nowrap mt-20 sm:mt-16">
            Create an Account
          </h1>

          <div className="space-y-6 sm:space-y-8">
            {/* Container 1: Full Name */}
            <div className="flex justify-center">
              <div className="w-[90%] sm:w-[80%]">
                <label className="text-[#000000]/80 text-lg sm:text-xl font-medium block mb-2 text-left pl-1 sm:pl-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-[#D3D3D3] text-[#000000]/80 text-base sm:text-lg font-normal py-3 px-4 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#3F48CC] transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Container 2: Email */}
            <div className="flex justify-center">
              <div className="w-[90%] sm:w-[80%]">
                <label className="text-[#000000]/80 text-lg sm:text-xl font-medium block mb-2 text-left pl-1 sm:pl-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#D3D3D3] text-[#000000]/80 text-base sm:text-lg font-normal py-3 px-4 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#3F48CC] transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Container 3: Password */}
            <div className="flex justify-center">
              <div className="w-[90%] sm:w-[80%]">
                <label className="text-[#000000]/80 text-lg sm:text-xl font-medium block mb-2 text-left pl-1 sm:pl-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#D3D3D3] text-[#000000]/80 text-base sm:text-lg font-normal py-3 px-4 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#3F48CC] transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex justify-center">
                <p className="text-red-500 text-sm sm:text-base w-[90%] sm:w-[80%] text-left pl-1 sm:pl-2">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-[#3F48CC] text-[#FFFFFF] text-sm sm:text-xl font-extrabold py-2 sm:py-4 px-4 sm:px-10 rounded-[10px] my-8 sm:my-10 hover:bg-[#2E3AB3] transition-all duration-200"
            >
              Sign Up
            </button>
          </div>

          <p className="text-[#000000]/80 text-base sm:text-lg font-normal mb-12 sm:mb-16">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#3F48CC] no-underline hover:underline transition-all duration-200"
            >
              Log In
            </Link>
          </p>
        </div>
      </main>
      <div />
    </div>
  );
}

export default SignUpPage;