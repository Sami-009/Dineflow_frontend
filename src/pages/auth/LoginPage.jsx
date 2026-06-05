// LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as apiLogin } from '../../services/authService';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { LogIn, Key, Mail, ShieldAlert } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Find previous attempted page or fallback to defaults
  const from = location.state?.from?.pathname || '/menu';

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    
    if (!password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await apiLogin({ email, password });
      
      if (response.otpRequired) {
        navigate('/verify-otp', {
          state: {
            email: response.email,
            from: from
          }
        });
        return;
      }
      
      // Update global context (Fallback if OTP is bypassed)
      login(response.user, response.token);
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.response?.data?.message || 'Login failed. Please verify credentials and database connections.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-6 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <span className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-orange-500/25">
              DF
            </span>
          </div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
            Welcome back to DineFlow
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-semibold text-orange-500 hover:text-orange-600">
              create a new customer account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 border border-gray-100 rounded-3xl shadow-sm sm:px-10">
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2 text-red-700 text-xs font-medium">
                <ShieldAlert className="h-4.5 w-4.5 text-red-500 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                    }}
                    placeholder="e.g. customer@dineflow.com"
                    className={`block w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                        : 'border-gray-200 focus:ring-orange-100 focus:border-orange-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Key className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: '' }));
                    }}
                    placeholder="••••••••"
                    className={`block w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 ${
                      errors.password
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                        : 'border-gray-200 focus:ring-orange-100 focus:border-orange-500'
                    }`}
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 active:scale-98 transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed shadow-md shadow-orange-500/10"
                >
                  {loading ? (
                    <span className="flex items-center space-x-1">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Checking credentials...</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1.5">
                      <LogIn className="h-4.5 w-4.5" />
                      <span>Log In</span>
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-[11px] text-gray-500 leading-normal space-y-1">
                <p className="font-semibold text-gray-700">Quick Test Credentials:</p>
                <p>🔑 <span className="font-semibold text-gray-600">Admin:</span> admin@dineflow.com | admin123</p>
                <p>🔑 <span className="font-semibold text-gray-600">Customer:</span> customer@dineflow.com | customer123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default LoginPage;
