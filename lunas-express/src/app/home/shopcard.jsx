import { FaShoppingCart } from "react-icons/fa";

export default function ShopCard({
  title,
  provider,
  reviews,
  stars,
  price,
  image,
}) {
  return (
    <>
      <div className="bg-gray-100 rounded-md shadow-lg">
        <img
          className="w-full h-35 object-cover object-center overflow-hidden rounded-tr-md rounded-tl-md"
          src={image}
        />
        <div className="p-3 break-words relative">
          <div className="text-md font-semibold">{title}</div>
          <div className="text-xs font-light">{provider}</div>
          <div className="text-xs font-light">
            {stars} <span>{`(${reviews})`}</span>
          </div>
          <div className="flex items-center mt-4">
            <div className="text-xl text-blue-700 font-semibold flex-1">
              {price}
            </div>
            <div className="p-3 text-gray-100 bg-amber-500 rounded-[50%] cursor-pointer">
              <FaShoppingCart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
