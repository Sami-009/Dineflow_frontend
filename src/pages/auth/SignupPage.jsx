// SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../services/authService';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { UserPlus, User, Mail, Phone, Key, CheckCircle, ShieldAlert } from 'lucide-react';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!formData.email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await signup(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2500);
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to create account. Please try again.');
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-semibold text-orange-500 hover:text-orange-600">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 border border-gray-100 rounded-3xl shadow-sm sm:px-10">
            {success ? (
              <div className="text-center py-6 space-y-3">
                <div className="inline-flex p-3 bg-emerald-50 text-emerald-500 rounded-full">
                  <CheckCircle className="h-10 w-10 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Account Created!</h3>
                <p className="text-sm text-gray-500 leading-normal">
                  Thank you for signing up. Redirecting you to the sign in page...
                </p>
              </div>
            ) : (
              <>
                {errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2 text-red-700 text-xs font-medium">
                    <ShieldAlert className="h-4.5 w-4.5 text-red-500 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className={`block w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 ${errors.name
                            ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                            : 'border-gray-200 focus:ring-orange-100 focus:border-orange-500'
                          }`}
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                  </div>

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
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. customer@dineflow.com"
                        className={`block w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 ${errors.email
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
                      Password (6+ characters)
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Key className="h-4 w-4" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`block w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 ${errors.password
                            ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                            : 'border-gray-200 focus:ring-orange-100 focus:border-orange-500'
                          }`}
                      />
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                  </div>

                  {/* Phone number (optional) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Phone Number (optional)
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +1234567890"
                        className="block w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 border-gray-200 focus:ring-orange-100 focus:border-orange-500"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Optional: used for SMS order updates if provided.</p>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Delivery Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className={`block w-full pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 ${errors.address
                          ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                          : 'border-gray-200 focus:ring-orange-100 focus:border-orange-500'
                        }`}
                    />
                    {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Foodtown"
                      className={`block w-full pl-3 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 ${errors.city
                          ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                          : 'border-gray-200 focus:ring-orange-100 focus:border-orange-500'
                        }`}
                    />
                    {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
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
                          <span>Creating account...</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1.5">
                          <UserPlus className="h-4.5 w-4.5" />
                          <span>Register</span>
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default SignupPage;
