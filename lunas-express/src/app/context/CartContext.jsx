// src/app/context/CartContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc, updateDoc,doc,onSnapshot} from "firebase/firestore";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cartCollection = collection(db, "cart");

    // Real-time cart count updates
    const unsubscribe = onSnapshot(
      cartCollection,
      (snapshot) => {
        const totalItems = snapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().quantity || 1), 
          0
        );
        setCartCount(totalItems);
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

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}