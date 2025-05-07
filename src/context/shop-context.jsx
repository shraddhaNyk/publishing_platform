import React, { createContext, useState } from "react";
import { PRODUCTS } from "../products";

// Create a context for the shopping cart
export const ShopContext = createContext(null);

// Function to generate a default shopping cart with all product items set to 0 quantity
const getDefaultCart = () => {
  let cart = {};
  for (let i = 1; i < PRODUCTS.length + 1; i++) {
    cart[i] = 0;
  }
  return cart;
};

// Component to provide shopping cart functionality to its children
export const ShopContextProvider = (props) => {
  // State to manage the items in the shopping cart
  const [cartItems, setCartItems] = useState(getDefaultCart());

  // Function to calculate the total amount of the items in the cart
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = PRODUCTS.find((product) => product.id === Number(item));
        totalAmount += cartItems[item] * itemInfo.price;
      }
    }
    return totalAmount;
  };

  // Function to add an item to the cart
  const addToCart = (itemId) => {
    // Check if the item is already in the cart
    if (cartItems[itemId] === 0) {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  // Function to update the quantity of an item in the cart
  const updateCartItemCount = (newAmount, itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: newAmount }));
  };

  // Function to reset the cart to its default state (empty)
  const checkout = () => {
    setCartItems(getDefaultCart());
  };

  // Value of the context that will be provided to its children components
  const contextValue = {
    cartItems,
    addToCart,
    updateCartItemCount,
    removeFromCart,
    getTotalCartAmount,
    checkout,
  };

  // Provide the context value to the children components
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
