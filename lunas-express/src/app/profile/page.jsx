// src/app/profile/page.jsx
"use client";

import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Header from "../components/header";

export default function Profile() {
  const { cartCount } = useCart();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // State for shipping details
  const [shippingDetails, setShippingDetails] = useState(null); // No default values
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [tempShippingDetails, setTempShippingDetails] = useState({
    recipientName: "",
    address: "",
    contactNumber: "",
  });
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/");
      } else {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || currentUser.displayName || "User");
          if (userData.shippingDetails) {
            setShippingDetails(userData.shippingDetails);
            setTempShippingDetails(userData.shippingDetails);
          } else {
            setShippingDetails(null);
          }
          if (userData.paymentMethods) {
            setPaymentMethods(userData.paymentMethods);
          }
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

  const handleSaveName = async () => {
    const userDocRef = doc(db, "users", user.uid);
    try {
      await setDoc(userDocRef, { name: userName }, { merge: true });
      setIsEditingName(false);
    } catch (error) {
      console.error("Error saving name:", error);
      setErrorMessage("Failed to save name.");
    }
  };

  const handleChangePassword = async () => {
    setErrorMessage("");
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setNewPassword("");
      setCurrentPassword("");
      setIsChangingPassword(false);
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Current password is incorrect.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("New password is too weak. It must be at least 6 characters.");
      } else {
        setErrorMessage("Failed to update password. Please try again.");
      }
    }
  };

  const handleEditShipping = () => {
    setTempShippingDetails(shippingDetails || { recipientName: "", address: "", contactNumber: "" });
    setIsEditingShipping(true);
  };

  const handleShippingInputChange = (e) => {
    const { name, value } = e.target;
    setTempShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveShipping = async () => {
    setShippingDetails(tempShippingDetails);
    setIsEditingShipping(false);

    const userDocRef = doc(db, "users", user.uid);
    try {
      await setDoc(userDocRef, { shippingDetails: tempShippingDetails }, { merge: true });
    } catch (error) {
      console.error("Error saving shipping details:", error);
      setErrorMessage("Failed to save shipping details.");
    }
  };

  const handleCancelShipping = () => {
    setTempShippingDetails(shippingDetails || { recipientName: "", address: "", contactNumber: "" });
    setIsEditingShipping(false);
  };

  const handleDeletePaymentMethod = async (methodId) => {
    const updatedMethods = paymentMethods.filter((method) => method.id !== methodId);
    setPaymentMethods(updatedMethods);

    const userDocRef = doc(db, "users", user.uid);
    try {
      await setDoc(userDocRef, { paymentMethods: updatedMethods }, { merge: true });
    } catch (error) {
      console.error("Error deleting payment method:", error);
      setErrorMessage("Failed to delete payment method.");
    }
  };

  return (
    <div className="bg-[#ededed] min-h-screen">
      <Header showSearch={false} />

      <div className="max-w-6xl mx-auto py-10">
        <h1 className="text-3xl font-semibold text-cyan-700 mb-8">User Profile</h1>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-cyan-700 mb-4">User Details</h2>
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Name</h3>
              {!isEditingName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-cyan-500 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            {isEditingName ? (
              <div className="mt-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={handleSaveName}
                    className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 mt-1">{userName}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Password</h3>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-cyan-500 hover:underline"
                >
                  Change Password
                </button>
              )}
            </div>
            {isChangingPassword && (
              <div className="mt-2">
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleChangePassword}
                    className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setNewPassword("");
                      setCurrentPassword("");
                      setIsChangingPassword(false);
                      setErrorMessage("");
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-700">Shipping Details</h2>
            <button
              onClick={handleEditShipping}
              className="text-cyan-500 hover:underline"
            >
              {shippingDetails ? "Edit" : "Add"}
            </button>
          </div>
          {isEditingShipping ? (
            <div className="mt-4">
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">
                  Recipient's Name
                </label>
                <input
                  type="text"
                  name="recipientName"
                  value={tempShippingDetails.recipientName}
                  onChange={handleShippingInputChange}
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
                  value={tempShippingDetails.address}
                  onChange={handleShippingInputChange}
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
                  value={tempShippingDetails.contactNumber}
                  onChange={handleShippingInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveShipping}
                  className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600"
                  disabled={!tempShippingDetails.recipientName || !tempShippingDetails.address || !tempShippingDetails.contactNumber}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelShipping}
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

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-cyan-700 mb-4">Saved Payment Methods</h2>
          {paymentMethods.length === 0 ? (
            <p className="text-gray-600">No saved payment methods.</p>
          ) : (
            paymentMethods.map((method) => (
              <div key={method.id} className="flex justify-between items-center mb-4 border-b pb-2">
                <div>
                  <p className="text-lg font-semibold">{method.type}</p>
                  <p className="text-sm text-gray-600">{method.details}</p>
                </div>
                <button
                  onClick={() => handleDeletePaymentMethod(method.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}