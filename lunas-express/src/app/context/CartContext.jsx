// CartContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase/config'; // adjust paths based on your project

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  // Listen for user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const cartRef = doc(db, 'carts', currentUser.uid);
        const cartSnap = await getDoc(cartRef);
        if (cartSnap.exists()) {
          setCartItems(cartSnap.data().items || []);
        } else {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Update Firestore whenever cartItems changes
  useEffect(() => {
    const saveCart = async () => {
      if (user) {
        const cartRef = doc(db, 'carts', user.uid);
        await setDoc(cartRef, { items: cartItems });
      }
    };
    saveCart();
  }, [cartItems, user]);

  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};