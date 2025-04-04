import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export default function ShopCard({ id, title, provider, reviews, stars, price, image }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const item = { id, title, provider, reviews, stars, price: parseFloat(price.replace("$", "")), image };
    addToCart(item);
  };

  return (
    <div className="bg-gray-100 rounded-md shadow-lg">
      <img className="w-full h-35 object-cover object-center overflow-hidden rounded-tr-md rounded-tl-md" src={image} />
      <div className="p-3 break-words relative">
        <div className="text-md font-semibold">{title}</div>
        <div className="text-xs font-light">{provider}</div>
        <div className="text-xs font-light">{stars} <span>{`(${reviews})`}</span></div>
        <div className="flex items-center mt-4">
          <div className="text-xl text-blue-700 font-semibold flex-1">{price}</div>
          <div className="flex gap-3">
          <motion.button
            onClick={handleAddToCart}
            className="text-gray-600 hover:text-amber-500"
            whileTap={{ scale: 0.8 }} // Scale down on click
            whileHover={{ scale: 1.2 }} // Scale up on hover
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