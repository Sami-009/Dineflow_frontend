// AdminMenuPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../hooks/useMenu';
import { addMenuItem, updateMenuItem, deleteMenuItem, updateMenuAvailability } from '../../services/menuService';
import AdminLayout from '../../components/layout/AdminLayout';
import MenuItemForm from '../../components/menu/MenuItemForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, ToggleLeft, ToggleRight } from 'lucide-react';

export const AdminMenuPage = () => {
  const { token } = useAuth();
  const { menuItems, loading, error, refetch } = useMenu(true); // Fetch all (including unavailable)

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // null means ADD mode, object means EDIT mode
  const [actionError, setActionError] = useState('');

  const handleOpenAddForm = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const handleSaveItem = async (formData) => {
    setActionError('');
    try {
      if (selectedItem) {
        // Edit mode
        await updateMenuItem(selectedItem.id, formData, token);
      } else {
        // Add mode
        await addMenuItem(formData, token);
      }
      handleCloseForm();
      refetch();
    } catch (err) {
      console.error('Failed to save menu item:', err);
      setActionError(err.response?.data?.message || 'Error occurred while saving item details.');
    }
  };

  const handleDeleteItem = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to permanently delete '${name}' from the menu?`);
    if (!confirmed) return;

    setActionError('');
    try {
      await deleteMenuItem(id, token);
      refetch();
    } catch (err) {
      console.error('Failed to delete menu item:', err);
      setActionError(err.response?.data?.message || 'Error occurred while deleting item.');
    }
  };

  const handleToggleAvailability = async (id, currentAvailability) => {
    setActionError('');
    try {
      await updateMenuAvailability(id, { is_available: !currentAvailability }, token);
      refetch();
    } catch (err) {
      console.error('Failed to toggle availability:', err);
      setActionError(err.response?.data?.message || 'Error occurred while toggling availability.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Manage Menu Items</h2>
            <p className="text-xs text-gray-400 mt-1">Add, update, or remove dishes from the digital catalog and manage currently available dishes.</p>
          </div>
          <button
            onClick={handleOpenAddForm}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 text-xs font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/10"
          >
            <Plus className="h-4 w-4" />
            <span>Add Menu Item</span>
          </button>
        </div>

        {/* Action errors banner */}
        {actionError && (
          <div className="p-4 bg-red-50 border border-red-200 text-xs font-semibold text-red-700 rounded-xl">
            {actionError}
          </div>
        )}

        {/* Loaders / Errors */}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <>
            {menuItems.length === 0 ? (
              <EmptyState
                message="No menu items exist yet. Click the 'Add Menu Item' button to create your first dish!"
                actionLabel="Create Item"
                onAction={handleOpenAddForm}
              />
            ) : (
              <div className="overflow-x-auto bg-white border border-gray-150 rounded-2xl shadow-sm">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Dish Image
                      </th>
                      <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                        Price (Rs.)
                      </th>
                      <th scope="col" className="px-6 py-4.5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Availability Status
                      </th>
                      <th scope="col" className="px-6 py-4.5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Quick Toggle
                      </th>
                      <th scope="col" className="px-6 py-4.5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-55/30 transition-colors">
                        {/* Image */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <div className="h-12 w-20 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4.5">
                          <div className="flex flex-col max-w-xs">
                            <span className="text-sm font-bold text-gray-900 truncate">{item.name}</span>
                            <span className="text-xs text-gray-400 truncate mt-0.5">{item.description || 'No description.'}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4.5 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {item.category}
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4.5 whitespace-nowrap text-sm font-extrabold text-gray-900 text-right">
                          {formatCurrency(item.price)}
                        </td>

                        {/* Availability Status Badge */}
                        <td className="px-6 py-4.5 whitespace-nowrap text-center">
                          {item.is_available ? (
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 text-xs font-bold">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span>🟢 Available</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-50 border border-red-100 rounded-lg text-red-700 text-xs font-bold">
                              <span className="h-2 w-2 rounded-full bg-red-500"></span>
                              <span>🔴 Unavailable</span>
                            </span>
                          )}
                        </td>

                        {/* Quick Toggle Button */}
                        <td className="px-6 py-4.5 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleToggleAvailability(item.id, item.is_available)}
                            className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-bold border rounded-lg transition-colors ${
                              item.is_available
                                ? 'border-red-200 text-red-650 hover:bg-red-50/50'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50/50'
                            }`}
                          >
                            {item.is_available ? 'Mark Unavailable' : 'Mark Available'}
                          </button>
                        </td>

                        {/* Action buttons */}
                        <td className="px-6 py-4.5 whitespace-nowrap text-center text-xs font-bold space-x-2">
                          <button
                            onClick={() => handleOpenEditForm(item)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-950 transition-colors"
                            title="Edit details"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </button>
                          
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 border border-red-100 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Modal form Add/Edit */}
        {isFormOpen && (
          <MenuItemForm
            item={selectedItem}
            onSave={handleSaveItem}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMenuPage;
