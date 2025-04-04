// cart/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import CartItem from './CartItem';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaSearch, FaTrash } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cartCount } = useCart(); // Access the cart count

  // Fetch cart items from Firebase
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartCollection = collection(db, 'cart');
        const cartSnapshot = await getDocs(cartCollection);
        const cartList = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCartItems(cartList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="bg-[#ededed] min-h-screen">
      {/* Header */}
      <header className="bg-cyan-500 mx-15 rounded-b-lg relative top-0 inset-x-0 flex items-center">
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
        <a className="relative">
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
            <MdAccountCircle />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex mx-20 pt-10 pb-20 gap-6">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-5">
            <input type="checkbox" className="w-5 h-5" />
            <span className="text-lg font-semibold">Select All ({cartItems.length} item(s))</span>
            <button className="ml-auto text-gray-600 hover:text-red-500">
              <FaTrash className="inline mr-1" /> Delete
            </button>
          </div>
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : cartItems.length === 0 ? (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          ) : (
            cartItems.map(item => <CartItem key={item.id} item={item} />)
          )}
        </div>

        {/* Order Summary */}
        <div className="w-80 bg-gray-100 rounded-md shadow-lg p-5">
          <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
          <p className="text-sm text-gray-600 mb-3">Location: NY, USA</p>
          <div className="flex justify-between mb-2">
            <p>Subtotal ({cartItems.length} items)</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p>Shipping Fee</p>
            <p>$0.00</p>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Enter Voucher Code"
              className="flex-1 bg-white p-2 rounded-lg border border-gray-300"
            />
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg">Apply</button>
          </div>
          <div className="flex justify-between font-semibold mb-5">
            <p>Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <button className="w-full bg-amber-500 text-gray-100 py-3 rounded-lg font-semibold">
            Proceed to Checkout ({cartItems.length})
          </button>
        </div>
      </div>
    </div>
  );
}