// cart/CartItem.jsx
import { useState } from 'react';
import { FaHeart, FaTrash } from 'react-icons/fa';

export default function CartItem({ item }) {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      // Update Firebase quantity here if needed
    }
  };

  return (
    <div className="bg-gray-100 rounded-md shadow-lg p-3 flex items-center gap-3 mb-3">
      <input type="checkbox" className="w-5 h-5" />
      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-md" />
      <div className="flex-1">
        <p className="text-md font-semibold">{item.title}</p>
        <p className="text-xs font-light text-gray-600">{item.provider}</p>
        <p className="text-xl text-blue-700 font-semibold">${item.price}</p> {/* Change to dollars */}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(-1)}
          className="bg-gray-300 text-gray-600 px-3 py-1 rounded-lg"
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => handleQuantityChange(1)}
          className="bg-gray-300 text-gray-600 px-3 py-1 rounded-lg"
        >
          +
        </button>
      </div>
      <div className="flex gap-3">
        <button className="text-gray-600 hover:text-red-500">
          <FaTrash />
        </button>
      </div>
    </div>
  );
}