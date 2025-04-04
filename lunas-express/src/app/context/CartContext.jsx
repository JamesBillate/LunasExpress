// src/app/context/CartContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc, updateDoc, doc, onSnapshot, deleteDoc } from "firebase/firestore";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // Add cartItems state
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cartCollection = collection(db, "cart");

    // Real-time listener for cart items
    const unsubscribe = onSnapshot(
      cartCollection,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          docId: doc.id, // Store the Firestore document ID
          ...doc.data(),
        }));
        setCartItems(items); // Update cartItems state
        const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalItems); // Update cartCount
      },
      (error) => {
        console.error("Error listening to cart updates:", error);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Function to add or update an item in the cart
  const addToCart = async (item) => {
    try {
      const cartCollection = collection(db, "cart");
      const cartSnapshot = await getDocs(cartCollection);

      // Check if item exists in the cart
      const existingItemDoc = cartSnapshot.docs.find(
        (doc) => doc.data().id === item.id
      );

      if (existingItemDoc) {
        // Update quantity if item already exists
        const itemRef = doc(db, "cart", existingItemDoc.id);
        const newQuantity = existingItemDoc.data().quantity + 1;
        await updateDoc(itemRef, { quantity: newQuantity });
      } else {
        // Add new item if not in cart
        await addDoc(cartCollection, { ...item, quantity: 1 });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = async (docId) => {
    try {
      const itemRef = doc(db, "cart", docId);
      await deleteDoc(itemRef);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}