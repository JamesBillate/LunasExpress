// src/app/home/shopcard.jsx
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export default function ShopCard({ id, title, provider, reviews, stars, price, image }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const item = {
      id,
      title,
      provider,
      reviews,
      stars,
      price: parseFloat(price.replace("$", "")), // Parse price for CartContext
      image,
      quantity: 1, // Add quantity property
    };
    addToCart(item);
  };

  return (
    <div className="bg-white rounded-md shadow-lg">
      {/* Changed h-35 to h-40 */}
      <img
        className="w-full h-40 object-cover object-center overflow-hidden rounded-tr-md rounded-tl-md"
        src={image}
        alt={title}
      />
      <div className="p-3 break-words relative">
        <div className="text-md font-semibold">{title}</div>
        <div className="text-xs font-light">{provider}</div>
        <div className="text-xs font-light">
          {stars} <span>{`(${reviews})`}</span>
        </div>
        <div className="flex items-center mt-4">
          <div className="text-xl text-blue-700 font-semibold flex-1">{price}</div>
          <div className="flex gap-3">
            <motion.button
              onClick={handleAddToCart}
              className="text-gray-600 hover:text-amber-500"
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
            >
              <FaShoppingCart size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}