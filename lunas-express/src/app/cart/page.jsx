// src/app/cart/page.jsx
"use client";

import { onAuthStateChanged } from "firebase/auth";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { auth, db } from "../firebase/config";
import Header from "../components/header";

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
      {/* Header without search */}
        <Header showSearch={false} />

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