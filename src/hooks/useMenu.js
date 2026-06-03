// useMenu.js
import { useState, useEffect, useCallback } from 'react';
import { getMenuItems } from '../services/menuService';

/**
 * Custom hook to load menu items from API.
 * Flow: React menu component calls useMenu -> useMenu calls menuService -> service sends GET /menu ->
 * backend menuController executes SQL query against PostgreSQL -> menu items are returned as JSON.
 * The hook captures loading state, errors, and the response list for the component to render.
 *
 * @param {boolean} showAll - True to fetch all items (including unavailable), false/undefined for available only
 */
export const useMenu = (showAll = false) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMenuItems(showAll);
      setMenuItems(data);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError(err.response?.data?.message || 'Failed to load menu items. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [showAll]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return {
    menuItems,
    loading,
    error,
    refetch: fetchMenu,
  };
};

export default useMenu;
