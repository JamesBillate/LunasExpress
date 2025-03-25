import { title } from "process";
import ShopCard from "./shopcard";

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
      <div className="bg-red-600 p-10 grid grid-cols-4 gap-3">
        {/* //title, provider, reviews, stars, price image */}
        {medicine.map((item) => (
          <ShopCard
            key={item.id} // always add a unique key
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
    </>
  );
}
