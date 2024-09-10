import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { CartInterface } from '../interface/ICart';

interface ShopContextType {
  cartItems: { [key: number]: number };
  setCartItems: (items: { [key: number]: number }) => void;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  getTotalCartAmount: () => number;
}

export const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    // Load cart items from local storage on initial render
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  useEffect(() => {
    // Save cart items to local storage whenever cartItems changes
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (id: number) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => {
      const newItems = { ...prev };
      delete newItems[id];
      return newItems;
    });
  };

  const getTotalCartAmount = () => {
    // Example logic to calculate total amount
    return Object.values(cartItems).reduce((total, amount) => total + amount * 10, 0); // Assuming each course price is 10 for this example
  };

  return (
    <ShopContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart, getTotalCartAmount }}>
      {children}
    </ShopContext.Provider>
  );
};
