// src/app/checkout/page.jsx
"use client";

import { createOrder } from "../firebase/orders";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Header from "../components/header";

export default function Checkout() {
  const { cartItems, cartCount } = useCart();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("credit");

  // State for shipping details and edit mode
  const [shippingDetails, setShippingDetails] = useState(null); // No default values
  const [isEditing, setIsEditing] = useState(false);
  const [tempDetails, setTempDetails] = useState({
    recipientName: "",
    address: "",
    contactNumber: "",
  });

  // Authentication check and fetch shipping details
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/");
      } else {
        // Fetch shipping details from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().shippingDetails) {
          setShippingDetails(userDoc.data().shippingDetails);
          setTempDetails(userDoc.data().shippingDetails);
        } else {
          // If no shipping details exist, keep them as null
          setShippingDetails(null);
        }
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
  const shippingFee = selectedDelivery === "standard" ? 30 : 60;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async () => {
    if (!user) return;
    if (!shippingDetails) {
      alert("Please provide your shipping details before placing an order.");
      return;
    }

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
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const existingMethods = userDoc.exists() && userDoc.data().paymentMethods ? userDoc.data().paymentMethods : [];
      const newMethod = {
        id: Date.now().toString(),
        type: selectedPayment,
        details: `${
          selectedPayment === "credit" ? "Credit Card" : selectedPayment === "ewallet" ? "E-Wallet" : "Cash on Delivery"
        }`,
      };
      const updatedMethods = [...existingMethods, newMethod];
      await setDoc(userDocRef, { paymentMethods: updatedMethods }, { merge: true });

      router.push(`/order-confirmation?orderId=${orderId}`);
    } catch (err) {
      console.error("Error placing order:", err);
      alert("There was a problem placing your order. Try again.");
    }
  };

  const handleEditClick = () => {
    setTempDetails(shippingDetails || { recipientName: "", address: "", contactNumber: "" });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setShippingDetails(tempDetails);
    setIsEditing(false);

    const userDocRef = doc(db, "users", user.uid);
    try {
      await setDoc(userDocRef, { shippingDetails: tempDetails }, { merge: true });
    } catch (error) {
      console.error("Error saving shipping details:", error);
      alert("Failed to save shipping details.");
    }
  };

  const handleCancel = () => {
    setTempDetails(shippingDetails || { recipientName: "", address: "", contactNumber: "" });
    setIsEditing(false);
  };

  return (
    <div className="bg-[#ededed] min-h-screen">
      <Header showSearch={false} />

      <div className="max-w-6xl mx-auto py-10 flex gap-6">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-cyan-700">Shipping Address</h2>
              <button
                onClick={handleEditClick}
                className="text-cyan-500 hover:underline"
              >
                {shippingDetails ? "Edit" : "Add"}
              </button>
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
                    required
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
                    required
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
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600"
                    disabled={!tempDetails.recipientName || !tempDetails.address || !tempDetails.contactNumber}
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
                {shippingDetails ? (
                  <>
                    <p>{shippingDetails.recipientName}</p>
                    <p>{shippingDetails.address}</p>
                    <p>{shippingDetails.contactNumber}</p>
                  </>
                ) : (
                  <p>No shipping details set. Please add your shipping details.</p>
                )}
              </div>
            )}
          </div>

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

        <div className="w-80 bg-white p-6 rounded-lg shadow-lg">
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