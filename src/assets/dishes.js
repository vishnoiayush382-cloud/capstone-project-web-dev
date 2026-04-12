import burger from "../assets/burger.jpg";
import pizza from "../assets/pizza.jpg";
import pasta from "../assets/pasta.png";

import spaghetti from "../assets/spaghetti.jpg";
import avocado from "../assets/Avacado.jpg";   // ⚠️ match your file name
import salad from "../assets/salad-bowl.jpg";
import noodles from "../assets/noodles.jpg";
import manchurian from "../assets/manchurian.jpg";
import friedRice from "../assets/fried-rice.jpg";
import sushi from "../assets/sushi.jpg";
import thai from "../assets/thai-curry.jpg";

export const dishes = [
  // 🍔 Western
  { name: "Burger", price: "₹100", image: burger, category: "Western" },
  { name: "Pizza", price: "₹200", image: pizza, category: "Western" },
  { name: "Pasta", price: "₹150", image: pasta, category: "Western" },
  { name: "Spaghetti", price: "₹299", image: spaghetti, category: "Western" },

  // 🥗 Healthy
  { name: "Avocado Toast", price: "₹189", image: avocado, category: "Healthy" },
  { name: "Salad Bowl", price: "₹199", image: salad, category: "Healthy" },

  // 🍜 Chinese
  { name: "Noodles", price: "₹159", image: noodles, category: "Chinese" },
  { name: "Manchurian", price: "₹219", image: manchurian, category: "Chinese" },
  { name: "Fried Rice", price: "₹249", image: friedRice, category: "Chinese" },

  // 🍣 Asian
  { name: "Sushi", price: "₹399", image: sushi, category: "Asian" },

  // 🍛 Thai
  { name: "Thai Curry", price: "₹399", image: thai, category: "Thai" },
];