import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Navbar from './Navbar';
import Footer from './Footer';

function LogInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('All fields are required');
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to log in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1EFE1] flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 sm:py-16">
        <div className="w-full max-w-md text-center px-4 sm:px-6">
          <h1 className="text-[#3F48CC] text-4xl sm:text-5xl font-extrabold mb-12 sm:mb-16 whitespace-nowrap mt-20 sm:mt-16">
            Log In to Your Account
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
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Container 2: Password */}
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
                  disabled={isSubmitting}
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
              className="bg-[#3F48CC] text-[#FFFFFF] text-sm sm:text-xl font-extrabold py-2 sm:py-4 px-4 sm:px-10 rounded-[10px] my-8 sm:my-10 hover:bg-[#2E3AB3] transition-all duration-200 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </button>
          </div>

          <p className="text-[#000000]/80 text-base sm:text-lg font-normal mb-4 sm:mb-6">
            Don’t have an account?{' '}
            <Link
              to="/signup"
              className="text-[#3F48CC] no-underline hover:underline transition-all duration-200"
            >
              Sign Up
            </Link>
          </p>

          <p className="text-[#000000]/80 text-base sm:text-lg font-normal mb-12 sm:mb-16">
            <Link
              to="/forgot-password"
              className="text-[#3F48CC] no-underline hover:underline transition-all duration-200"
            >
              Forgot Your Password?
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LogInPage;