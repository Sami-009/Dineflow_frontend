// MenuPage.jsx
import React, { useState } from 'react';
import { useMenu } from '../../hooks/useMenu';
import CustomerLayout from '../../components/layout/CustomerLayout';
import CategoryFilter from '../../components/menu/CategoryFilter';
import MenuCard from '../../components/menu/MenuCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { Sparkles, HelpCircle } from 'lucide-react';

export const MenuPage = () => {
  const { menuItems, loading, error } = useMenu(false); // Fetches only available items
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract list of unique categories from menu items
  const categories = menuItems.length > 0
    ? [...new Set(menuItems.map((item) => item.category))]
    : [];

  // Filter items
  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <CustomerLayout>
      {/* Banner / Hero header */}
      <div className="relative rounded-3xl bg-slate-900 overflow-hidden mb-8 shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-400 via-orange-600 to-slate-950 opacity-90"></div>
        
        {/* Banner graphics */}
        <div className="absolute top-0 right-0 h-full w-1/3 opacity-20 hidden md:block">
          <svg viewBox="0 0 100 100" className="h-full w-full fill-white">
            <path d="M50 0 L100 50 L100 100 L0 100 Z" />
          </svg>
        </div>

        <div className="relative max-w-2xl px-6 py-12 sm:px-12 sm:py-16 md:max-w-3xl">
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-white/10 text-white rounded-full text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Satisfy Your Cravings</span>
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Order delicious food online
          </h1>
          <p className="mt-4 text-sm sm:text-base text-orange-100 max-w-xl leading-relaxed">
            Choose from our premium selection of authentic Pakistani delicacies, sizzlers, Chinese classics, crispy burgers, pizzas, and mouthwatering desserts.
          </p>
        </div>
      </div>

      {/* Main Catalog Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-4">
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center space-x-2" id="menu">
            <span>Explore Menu</span>
            {menuItems.length > 0 && (
              <span className="text-xs font-normal text-gray-400">
                ({menuItems.length} items available)
              </span>
            )}
          </h2>
        </div>

        {/* Loading / Error states */}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <>
            {/* Category tabs selection */}
            {categories.length > 0 && (
              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            )}

            {/* Menu items grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                message={`No food items available in the '${selectedCategory}' category right now. Please explore other dishes!`}
                actionLabel="View All Dishes"
                onAction={() => setSelectedCategory('All')}
              />
            )}
          </>
        )}
      </div>
    </CustomerLayout>
  );
};

export default MenuPage;
