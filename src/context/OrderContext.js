import React, { createContext, useContext, useMemo, useState } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const addOrder = (orderData) => {
    const newOrder = {
      id: `#EM${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Processing',
      ...orderData,
      createdAt: Date.now(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const clearOrders = () => {
    setOrders([]);
  };

  const value = useMemo(
    () => ({
      orders,
      addOrder,
      updateOrderStatus,
      clearOrders,
    }),
    [orders]
  );

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};