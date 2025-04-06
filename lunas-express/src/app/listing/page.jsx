"use client";

import ShopCard from "../home/shopcard";
import EntryField, { Button } from "../commons/commons";
import { useState } from "react";
import { FaUpload } from "react-icons/fa6";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Listing() {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "products"), {
        image: image,
        title: title,
        provider: provider,
        price: price,
        stars: "⭐⭐⭐⭐⭐",
        reviews: 0,
      });

      setImage("");
      setTitle("");
      setProvider("");
      setPrice("");
    } catch (error) {
      alert("Error publishing the listing" + error.message);
    }
  };

  return (
    <>
      <div className="bg-amber-700 h-screen flex justify-center items-center">
        <div className="py-16 px-20 mx-10 grid grid-cols-2 bg-gray-300 rounded-lg">
          {/* Left Section: Form */}
          <form className="pr-10 grid" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold">Medicine Listing</h1>
            <EntryField
              placeholder="Enter the Image Link"
              type="text"
              onChange={(e) => setImage(e.target.value)}
              className="relative w-full p-2 border border-gray-300 rounded-md cursor-pointer file:hidden"
              value={image}
              icon={<FaUpload />}
            />
            <EntryField
              placeholder="Title"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <EntryField
              placeholder="Provider"
              type="text"
              onChange={(e) => setProvider(e.target.value)}
              value={provider}
            />
            <EntryField
              placeholder="Price"
              type="text"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
            <Button
              type="submit"
              label="List"
              color=" bg-blue-600 text-gray-50"
            />
          </form>

          {/* Right Section: Preview */}
          <div className="pl-10 grid gap-1">
            <h2 className="text-md font-normal">Preview</h2>
            <ShopCard
              key="1" // always add a unique key
              image={image || "https://via.placeholder.com/150"}
              id="123"
              title={title || "Title here"}
              provider={provider || "Displaying provider"}
              stars="⭐⭐⭐⭐⭐"
              reviews="999"
              price={(price && "$" + price) || "Price"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
