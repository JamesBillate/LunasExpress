// src/app/home/page.jsx
"use client";

import Header from "../components/header";
import ShopCard from "./shopcard";
import { Main } from "../commons/commons.jsx";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const medicine = [
  {
    id: "1",
    title: "Paracetamol",
    provider: "Unilab",
    stars: "⭐⭐⭐⭐",
    reviews: "5",
    price: "$50",
    image:
      "https://assets.unilab.com.ph/uploads/Common/Products/Biogesic/Biogesic-Tablet-Product-Shot-314.webp",
    category: "Medications",
  },
  {
    id: "2",
    title: "Ibuprofen",
    provider: "Pfizer",
    stars: "⭐⭐⭐⭐⭐",
    reviews: "12",
    price: "$75",
    image:
      "https://medsgo.ph/images/detailed/25/86b167b5ca6d43d0950795ca6d246ba9.jpg",
    category: "Medications",
  },
  {
    id: "3",
    title: "Amoxicillin",
    provider: "GSK",
    stars: "⭐⭐⭐⭐",
    reviews: "8",
    price: "$100",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmuGRAxn27seun7XFyhwV4XENcNVehCUddWA&s",
    category: "Drugs",
  },
  {
    id: "4",
    title: "Cetirizine",
    provider: "Bayer",
    stars: "⭐⭐⭐",
    reviews: "3",
    price: "$35",
    image:
      "https://www.claritin.com.ph/sites/g/files/vrxlpx32636/files/2023-07/Claritin_Tablet_5sHeroFront.png",
    category: "Supplements",
  },
  {
    id: "5",
    title: "Loperamide",
    provider: "Johnson & Johnson",
    stars: "⭐⭐⭐⭐",
    reviews: "7",
    price: "$60",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4BvSOMrFYfcij-r33l39WHRAG9sg5vXdKfw&s",
    category: "Medications",
  },
];

export default function Home() {
  const { cartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter medicines based on search term
  const filteredMedicines = medicine.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#ededed] h-[100%]">
      {/* Header with search functionality */}
      <Header showSearch={true} onSearch={setSearchTerm} />

      {/* Banner Section with Category Buttons */}
      <div className="relative">
        <div className="p-8 mx-15 absolute bottom-0 inset-x-0 flex justify-center items-center gap-3">
          <Main label="Medications" color="bg-[#26a123] text-gray-100" />
          <Main label="Drugs" color="bg-[#2d21b5] text-gray-100" />
          <Main label="Vitamins" color="bg-[#f77a05] text-gray-100" />
          <Main label="Supplements" color="bg-[#d10a74] text-gray-100" />
        </div>
      </div>

      {/* Medicine Grid */}
      <div className="grid grid-cols-4 gap-6 mx-20 pt-10 pb-20">
        {filteredMedicines.map((item) => (
          <ShopCard
            key={item.id}
            image={item.image}
            id={item.id}
            title={item.title}
            provider={item.provider}
            stars={item.stars}
            reviews={item.reviews}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
}