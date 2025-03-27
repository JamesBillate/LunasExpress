"use client";

import ShopCard from "../home/shopcard";
import EntryField, { Button } from "../commons/Fields";
import { useState } from "react";
import { FaUpload } from "react-icons/fa6";

export default function Listing() {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [price, setPrice] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  return (
    <>
      <div className="bg-amber-700 h-screen flex justify-center items-center">
        <div className="py-16 px-20 mx-10 grid grid-cols-2 bg-gray-300 rounded-lg">
          {/* Left Section: Form */}
          <div className="pr-10 grid">
            <h1 className="text-2xl font-bold">Medicine Listing</h1>
            <EntryField
              placeholder="Upload Image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="relative w-full p-2 border border-gray-300 rounded-md cursor-pointer file:hidden"
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
          </div>

          {/* Right Section: Preview */}
          <div className="pl-10 grid gap-1">
            <h2 className="text-md font-normal">Preview</h2>
            <ShopCard
              key="1" // always add a unique key
              image={previewImage || "https://via.placeholder.com/150"}
              id="123"
              title={title || "Title here"}
              provider={provider || "Displaying provider"}
              stars="⭐⭐⭐⭐⭐"
              reviews="999"
              price={price || "Price"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
