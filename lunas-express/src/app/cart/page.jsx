// src/app/cart/page.jsx
"use client";

import { onAuthStateChanged } from "firebase/auth";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore"; // Import Firestore functions
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { useCart } from "../context/CartContext";
import { auth, db } from "../firebase/config";

export default function Cart() {
  const { cartItems = [], cartCount, removeFromCart } = useCart();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartItemsState, setCartItems] = useState([]);

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/");
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch cart data
  useEffect(() => {
    if (user) {
      const cartRef = doc(db, "carts", user.uid);
      const getCartData = async () => {
        const docSnap = await getDoc(cartRef);
        if (docSnap.exists()) {
          setCartItems(docSnap.data().items || []);
        }
        setLoadingCart(false); // End loading
      };
      getCartData();
    }
  }, [user]);

  const handleRemove = async (docId) => {
    try {
      const cartRef = doc(db, "carts", user.uid);
      await updateDoc(cartRef, {
        items: arrayRemove(docId),
      });
      setCartItems((prevItems) => prevItems.filter(item => item.docId !== docId));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  if (loadingCart) {
    return <div>Loading your cart...</div>; // Show loading message while cart is loading
  }

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = 30; // Default to Standard shipping fee
  const total = subtotal + shippingFee;

  return (
    <div className="bg-[#ededed] min-h-screen">
      {/* Header */}
      <div className="bg-[url('https://api.watsons.com.ph/medias/Homepage-Main-Banner-1170x528.jpg?context=bWFzdGVyfGltYWdlc3wzNjAwODZ8aW1hZ2UvanBlZ3xhRFkzTDJnNE5DOHhOams0TlRJd09EQTJNVGs0TWk5SWIyMWxjR0ZuWlNCTllXbHVJRUpoYm01bGNpQXRJREV4TnpCNE5USTRMbXB3Wnd8NTRlZjUyZGQ5NDhiZTM5MmUxMDAxZmVmNzA2YWY1ZWFkOTQyOGI3MTEyZTllZjA2NDAxYzc0NjRhZjY1ZWU4Nw')] bg-cover bg-center h-90 relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-8 before:bg-gradient-to-t before:from-black/20 before:to-transparent">
        <header className="bg-cyan-500 mx-15 rounded-b-lg absolute top-0 inset-x-0 flex items-center">
          <div className="relative bg-cyan-700 p-5 w-80 text-white rounded-b-lg clip-path-triangle">
            <img src="/lunasexpress-neg.png" className="w-44 ml-5" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-2/3">
              <input
                type="text"
                placeholder="Search here..."
                className="bg-gray-100 pl-10 py-2 pr-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 mr-10 items-center text-3xl text-gray-100 ml-auto p-3">
            <a href="/cart" className="relative">
              <FaShoppingCart size={24} />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full px-2 py-1"
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </a>
            <a>
              <MdAccountCircle size={24} />
            </a>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-10 flex gap-6">
        {/* Cart Items */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-cyan-700 mb-6">Your Cart</h2>
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : cartItems.length === 0 ? (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.docId || item.title} className="flex gap-4 mb-4 border-b pb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.provider}</p>
                  <p className="text-lg font-semibold text-amber-500">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <button
                  onClick={() => handleRemove(item.docId)} // Use docId instead of id
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="w-80 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-cyan-700 mb-4">Order Summary</h2>
          <div className="flex justify-between text-gray-600">
            <span>Subtotal ({cartCount} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 mt-1">
            <span>Shipping Fee</span>
            <span>${shippingFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold mt-2 mb-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}