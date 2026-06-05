// VerifyOtpPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { verifyOtp, resendOtp } from '../../services/authService';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { ShieldCheck, Mail, ShieldAlert, ArrowLeft, Send, RefreshCw } from 'lucide-react';

export const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Retrieve state passed from LoginPage
  const prefilledEmail = location.state?.email || '';
  const from = location.state?.from || '/menu';

  const [email, setEmail] = useState(prefilledEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [cooldown, setCooldown] = useState(60); // 60 seconds rate limit on client side

  const timerRef = useRef(null);

  // Set up resend cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [cooldown]);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!otp) {
      newErrors.otp = 'Verification code is required.';
    } else if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      newErrors.otp = 'OTP must be a 6-digit number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Allow only digits and limit to 6 characters
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      if (errors.otp) setErrors((prev) => ({ ...prev, otp: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await verifyOtp({ email: email.trim(), otp: otp.trim() });
      setSuccessMessage('Verification successful! Logging in...');

      // Update global auth context
      setTimeout(() => {
        login(response.user, response.token);

        // Redirect based on role
        if (response.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }, 1000);
    } catch (err) {
      console.error('OTP verification error:', err);
      setErrorMessage(err.response?.data?.message || 'Verification failed. Please check your OTP and try again.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email address is required to resend OTP.' }));
      return;
    }

    setResending(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await resendOtp({ email: email.trim() });
      setSuccessMessage('A new verification code has been sent to your email.');
      setCooldown(60); // Restart cooldown timer
    } catch (err) {
      console.error('Resend OTP error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setResending(false);
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
            Verify Your Identity
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit login verification code sent to your email address.
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

            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start space-x-2 text-green-700 text-xs font-medium">
                <ShieldCheck className="h-4.5 w-4.5 text-green-500 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Address */}
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
                    disabled={!!prefilledEmail}
                    placeholder="e.g. customer@dineflow.com"
                    className={`block w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                        : 'border-gray-200 focus:ring-orange-100 focus:border-orange-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* OTP Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 text-center">
                  6-Digit Verification Code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength={6}
                    placeholder="000000"
                    disabled={loading}
                    className={`block w-full px-3 py-3 text-center text-2xl font-mono tracking-[0.5em] focus:tracking-[0.5em] border rounded-xl focus:outline-none focus:ring-2 uppercase ${
                      errors.otp
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                        : 'border-gray-200 focus:ring-orange-100 focus:border-orange-500'
                    }`}
                  />
                </div>
                {errors.otp && <p className="mt-1 text-xs text-center text-red-600">{errors.otp}</p>}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 active:scale-98 transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed shadow-md shadow-orange-500/10"
                >
                  {loading ? (
                    <span className="flex items-center space-x-1">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Verifying...</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1.5">
                      <ShieldCheck className="h-4.5 w-4.5" />
                      <span>Verify Code</span>
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || resending}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white"
                >
                  {resending ? (
                    <span className="flex items-center space-x-1">
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      <span>Resending Code...</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1.5">
                      <Send className="h-4 w-4 text-orange-500" />
                      <span>
                        {cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Resend Code'}
                      </span>
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-gray-100 pt-4 text-center">
              <Link to="/login" className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-orange-500">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default VerifyOtpPage;
