// Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, LogOut, ShieldAlert } from 'lucide-react';
import CartDrawer from '../cart/CartDrawer';

export const Navbar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/menu');
  };

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);
  const handleContinueShopping = () => setIsCartOpen(false);
  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleBrowseMenu = () => {
    if (location.pathname === '/menu') {
      const section = document.getElementById('menu');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/menu');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
          {/* Logo & Menu link */}
          <div className="flex">
            <Link to="/menu" className="flex-shrink-0 flex items-center space-x-2">
              <span className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-orange-500/20">
                DF
              </span>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent hidden sm:inline-block">
                DineFlow
              </span>
            </Link>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4 items-center">
              <button
                type="button"
                onClick={handleBrowseMenu}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all-300 ${
                  isActive('/menu')
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Browse Menu
              </button>
              {isLoggedIn && !isAdmin && (
                <Link
                  to="/my-orders"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all-300 ${
                    isActive('/my-orders')
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  My Orders
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-all-300 ${
                    isActive('/admin') || location.pathname.startsWith('/admin')
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            {/* Cart Drawer Trigger (hidden for admins) */}
            {!isAdmin && (
              <button
                type="button"
                onClick={handleOpenCart}
                className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-all-300"
                aria-label="Open cart drawer"
              >
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Profile Info / Login-Logout */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-sm font-semibold text-gray-900 leading-none">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500 capitalize mt-1">
                    {user.role}
                  </span>
                </div>
                
                <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all-300"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all-300 shadow-sm shadow-orange-500/10"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>

    <CartDrawer
      isOpen={isCartOpen}
      onClose={handleCloseCart}
      onCheckout={handleCheckout}
      onContinueShopping={handleContinueShopping}
    />
  </>
  );
};

export default Navbar;
