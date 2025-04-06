// src/components/header.jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

export default function Header({ showSearch = true }) {
  const { cartCount } = useCart();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="bg-[url('https://api.watsons.com.ph/medias/Homepage-Main-Banner-1170x528.jpg?context=bWFzdGVyfGltYWdlc3wzNjAwODZ8aW1hZ2UvanBlZ3xhRFkzTDJnNE5DOHhOams0TlRJd09EQTJNVGs0TWk5SWIyMWxjR0ZuZlNCTllXbHVJRUpoYm01bGNpQXRJREV4TnpCNE5USTRMbXB3Wnd8NTRlZjUyZGQ5NDhiZTM5MmUxMDAxZmVmNzA2YWY1ZWFkOTQyOGI3MTEyZTllZjA2NDAxYzc0NjRhZjY1ZWU4Nw')] bg-cover bg-center h-90 relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-8 before:bg-gradient-to-t before:from-black/20 before:to-transparent"
      style={{
        backgroundImage: `url('https://api.watsons.com.ph/medias/Homepage-Main-Banner-1170x528.jpg?context=bWFzdGVyfGltYWdlc3wzNjAwODZ8aW1hZ2UvanBlZ3xhRFkzTDJnNE5DOHhOams0TlRJd09EQTJNVGs0TWk5SWIyMWxjR0ZuZlNCTllXbHVJRUpoYm01bGNpQXRJREV4TnpCNE5USTRMbXB3Wnd8NTRlZjUyZGQ5NDhiZTM5MmUxMDAxZmVmNzA2YWY1ZWFkOTQyOGI3MTEyZTllZjA2NDAxYzc0NjRhZjY1ZWU4Nw')`,
      }}
    >
      <header className="bg-cyan-500 mx-15 rounded-b-lg absolute top-0 inset-x-0 flex items-center">
        <div className="relative bg-cyan-700 p-5 w-80 text-white rounded-b-lg clip-path-triangle">
          <Link href="/home" className="relative">
            <img src="/lunasexpress-neg.png" className="w-44 ml-5" alt="Lunas Express Logo" />
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          {showSearch ? (
            <div className="relative w-2/3">
              <input
                type="text"
                placeholder="Search here..."
                className="bg-gray-100 pl-10 py-2 pr-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          ) : (
            <div className="w-2/3" /> // Placeholder to maintain layout
          )}
        </div>
        <div className="grid grid-cols-2 gap-10 mr-10 items-center text-3xl text-gray-100 ml-auto p-3">
          <Link href="/cart" className="relative">
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
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button onClick={handleToggleDropdown} className="focus:outline-none">
              <MdAccountCircle size={24} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <Link href="/profile">
                  <div
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Account Details
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}