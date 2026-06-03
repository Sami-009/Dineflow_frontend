// useOrders.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, getAllOrders } from '../services/orderService';

/**
 * Custom hook to load orders.
 * Flow: React orders page calls useOrders -> useOrders calls orderService -> service calls /orders or /orders/my ->
 * protected backend route authenticates JWT, queries PostgreSQL, and returns order JSON.
 * The hook then maps loading/error state and exposes a refetch callback for UI retry support.
 *
 * Automatically resolves whether the current user is an admin or a normal customer.
 */
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, isAdmin, isLoggedIn } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!isLoggedIn || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let data;
      if (isAdmin) {
        data = await getAllOrders(token);
      } else {
        data = await getMyOrders(token);
      }
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token, isAdmin, isLoggedIn]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
};

export default useOrders;
