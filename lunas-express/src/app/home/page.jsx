import { title } from "process";
import ShopCard from "./shopcard";
import { FaShoppingCart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { Main } from "../commons/commons.jsx";

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
  },
];

export default function Home() {
  return (
    <>
      <div className="bg-[#ededed] h-[100%]">
        <div className="bg-[url('https://api.watsons.com.ph/medias/Homepage-Main-Banner-1170x528.jpg?context=bWFzdGVyfGltYWdlc3wzNjAwODZ8aW1hZ2UvanBlZ3xhRFkzTDJnNE5DOHhOams0TlRJd09EQTJNVGs0TWk5SWIyMWxjR0ZuWlNCTllXbHVJRUpoYm01bGNpQXRJREV4TnpCNE5USTRMbXB3Wnd8NTRlZjUyZGQ5NDhiZTM5MmUxMDAxZmVmNzA2YWY1ZWFkOTQyOGI3MTEyZTllZjA2NDAxYzc0NjRhZjY1ZWU4Nw')] bg-cover bg-center h-90 relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-8 before:bg-gradient-to-t before:from-black/20 before:to-transparent">
          <header className="bg-cyan-500 mx-15 rounded-b-lg absolute top-0 inset-x-0 flex items-center">
            <div className="relative bg-cyan-700 p-5 w-80 text-white rounded-b-lg clip-path-triangle">
              <img src="/lunasexpress-neg.png" className="w-44 ml-5" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-2/3">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="bg-gray-100 pl-10 py-2 pr-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-10 mr-10 items-center text-3xl text-gray-100 ml-auto p-3">
              <a>
                <FaShoppingCart />
              </a>
              <a>
                <MdAccountCircle />
              </a>
            </div>
          </header>
          <div className="p-8 mx-15 absolute bottom-0 inset-x-0 flex justify-center items-center gap-3">
            <Main label="Medications" color="bg-[#26a123] text-gray-100" />
            <Main label="Drugs" color="bg-[#2d21b5] text-gray-100" />
            <Main label="Vitamins" color="bg-[#f77a05] text-gray-100" />
            <Main label="Supplements" color="bg-[#d10a74] text-gray-100" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6 mx-20 pt-10 pb-20">
          {/* //title, provider, reviews, stars, price image */}
          {medicine.map((item) => (
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
    </>
  );
}
