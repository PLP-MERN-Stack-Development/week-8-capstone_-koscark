import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.email.trim() ||
      !formData.newPassword.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setError('All fields are required');
      return;
    }
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords must match');
      return;
    }
    try {
      await axios.post('/api/users/forgot-password', {
        email: formData.email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      navigate('/login');
    } catch (err) {
      const errorDetails = err.response?.data?.error?.details || err.response?.data?.error?.data;
      const errorMessage = errorDetails
        ? errorDetails.map(err => err.message).join('; ')
        : err.response?.data?.error?.message || 'Failed to reset password';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1EFE1] flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 sm:py-16">
        <div className="w-full max-w-md text-center px-4 sm:px-6">
          <h1 className="text-[#3F48CC] text-4xl sm:text-5xl font-extrabold mb-12 sm:mb-16 whitespace-nowrap mt-20 sm:mt-16">
            Reset Your Password
          </h1>

          <div className="space-y-6 sm:space-y-8">
            {/* Container 1: Email */}
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

            {/* Container 2: New Password */}
            <div className="flex justify-center">
              <div className="w-[90%] sm:w-[80%]">
                <label className="text-[#000000]/80 text-lg sm:text-xl font-medium block mb-2 text-left pl-1 sm:pl-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-[#D3D3D3] text-[#000000]/80 text-base sm:text-lg font-normal py-3 px-4 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#3F48CC] transition-all duration-200"
                  placeholder="Enter your new password"
                />
              </div>
            </div>

            {/* Container 3: Confirm Password */}
            <div className="flex justify-center">
              <div className="w-[90%] sm:w-[80%]">
                <label className="text-[#000000]/80 text-lg sm:text-xl font-medium block mb-2 text-left pl-1 sm:pl-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#D3D3D3] text-[#000000]/80 text-base sm:text-lg font-normal py-3 px-4 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#3F48CC] transition-all duration-200"
                  placeholder="Confirm your new password"
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
              Reset
            </button>
          </div>

          <p className="text-[#000000]/80 text-base sm:text-lg font-normal mb-12 sm:mb-16">
            Remembered Your Password?{' '}
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

export default ForgotPasswordPage;