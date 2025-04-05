// src/app/checkout/page.jsx
"use client";
import { createOrder } from "../firebase/orders";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { motion } from "framer-motion";
import { saveOrder } from "../firebase/firestore";

export default function Checkout() {
  const { cartItems, cartCount } = useCart();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("credit");

  // State for shipping details and edit mode
  const [shippingDetails, setShippingDetails] = useState({
    recipientName: "John Doe",
    address: "123 Pharmacy St, New York, USA",
    contactNumber: "585-555-2293",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempDetails, setTempDetails] = useState(shippingDetails);

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

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = selectedDelivery === "standard" ? 30 : 60; // $30 for Standard, $60 for Express
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async () => {
    if (!user) return;
  
    const order = {
      userId: user.uid,
      cartItems,
      cartCount,
      shippingDetails,
      deliveryMethod: selectedDelivery,
      paymentMethod: selectedPayment,
      subtotal,
      shippingFee,
      total,
    };
  
    try {
      const orderId = await createOrder(user.uid, cartItems, total);
      router.push(`/order-confirmation?orderId=${orderId}`);
    } catch (err) {
      console.error("Error placing order:", err);
      alert("There was a problem placing your order. Try again.");
    }
  };

  // Handle edit button click
  const handleEditClick = () => {
    setTempDetails(shippingDetails); // Store current details in temp state
    setIsEditing(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save button click
  const handleSave = () => {
    setShippingDetails(tempDetails); // Update shipping details with edited values
    setIsEditing(false);
  };

  // Handle cancel button click
  const handleCancel = () => {
    setTempDetails(shippingDetails); // Revert to original details
    setIsEditing(false);
  };

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
        {/* Left Section: Shipping Address, Delivery Options, and Cart Items */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          {/* Shipping Address */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-cyan-700">Shipping Address</h2>
              {!isEditing && (
                <button
                  onClick={handleEditClick}
                  className="text-cyan-500 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            {isEditing ? (
              <div className="mt-4">
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Recipient's Name
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={tempDetails.recipientName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Shipping Address
                  </label>
                  <textarea
                    name="address"
                    value={tempDetails.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    rows="3"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={tempDetails.contactNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-600 mt-2">
                <p>{shippingDetails.recipientName}</p>
                <p>{shippingDetails.address}</p>
                <p>{shippingDetails.contactNumber}</p>
              </div>
            )}
          </div>

          {/* Delivery Options */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-cyan-700 mb-2">Choose your delivery option</h2>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="radio"
                  name="delivery"
                  value="standard"
                  checked={selectedDelivery === "standard"}
                  onChange={() => setSelectedDelivery("standard")}
                  className="form-radio text-cyan-500"
                />
                <div>
                  <p className="font-semibold">Standard - $30</p>
                  <p className="text-sm text-gray-600">Guaranteed by 8-13 Apr</p>
                </div>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="radio"
                  name="delivery"
                  value="express"
                  checked={selectedDelivery === "express"}
                  onChange={() => setSelectedDelivery("express")}
                  className="form-radio text-cyan-500"
                />
                <div>
                  <p className="font-semibold">Express - $60</p>
                  <p className="text-sm text-gray-600">Guaranteed by 8-9 Apr</p>
                </div>
              </label>
            </div>
          </div>

          {/* Cart Items */}
          <div>
            <h2 className="text-xl font-semibold text-cyan-700 mb-4">Items</h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.docId} className="flex gap-4 mb-4 border-b pb-4">
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
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Section: Payment Method and Order Summary */}
        <div className="w-80 bg-white p-6 rounded-lg shadow-lg">
          {/* Payment Method */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-cyan-700">Select payment method</h2>
              <button className="text-cyan-500 hover:underline">View all methods</button>
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="radio"
                  name="payment"
                  value="credit"
                  checked={selectedPayment === "credit"}
                  onChange={() => setSelectedPayment("credit")}
                  className="form-radio text-cyan-500"
                />
                <span>Credit/Debit Card</span>
              </label>
              <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="radio"
                  name="payment"
                  value="ewallet"
                  checked={selectedPayment === "ewallet"}
                  onChange={() => setSelectedPayment("ewallet")}
                  className="form-radio text-cyan-500"
                />
                <span>E-Wallet</span>
              </label>
              <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={selectedPayment === "cod"}
                  onChange={() => setSelectedPayment("cod")}
                  className="form-radio text-cyan-500"
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-cyan-700 mb-2">Order Summary</h2>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cartCount} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 mt-1">
              <span>Shipping Fee</span>
              <span>${shippingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold mt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            Place Order Now
          </button>
        </div>
      </div>
    </div>
  );
}