// MenuItemForm.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = [
  'Burgers',
  'Pizza',
  'BBQ',
  'Pakistani',
  'Chinese',
  'Fast Food',
  'Drinks',
  'Desserts',
];

export const MenuItemForm = ({ item, onSave, onClose }) => {
  const isEditMode = !!item;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
    is_available: true,
    image_url: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        category: item.category || CATEGORIES[0],
        is_available: item.is_available ?? true,
        image_url: item.image_url || '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Item name is required.';
    
    const priceNum = parseFloat(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum < 0) {
      newErrors.price = 'Please enter a valid non-negative price.';
    }
    
    if (!formData.category) newErrors.category = 'Category is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSave({
      ...formData,
      price: parseFloat(formData.price),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Item Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Garlic Naan, Zinger Burger"
              className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                  : 'border-gray-200 focus:ring-orange-100 focus:border-orange-500'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Brief description of ingredients, size, serving portion..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500"
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Price (Rs.) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="450"
                className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                  errors.price
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                    : 'border-gray-200 focus:ring-orange-100 focus:border-orange-500'
                }`}
              />
              {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Image URL
            </label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/food-image.jpg"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              name="is_available"
              id="is_available"
              checked={formData.is_available}
              onChange={handleChange}
              className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:outline-none"
            />
            <label htmlFor="is_available" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
              Mark as Available (Show in Menu)
            </label>
          </div>

          {/* Submit Actions */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/10"
            >
              {isEditMode ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemForm;
