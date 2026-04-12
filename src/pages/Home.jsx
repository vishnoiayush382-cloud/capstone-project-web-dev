import { useState } from "react";
import { dishes } from "../assets/dishes";

function Home({ addToCart }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Get unique categories
  const categories = ["All", ...new Set(dishes.map((d) => d.category))];

  // Filter dishes
  const filteredDishes = dishes.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      <h2 style={{ marginBottom: "15px" }}>Explore Menu</h2>

      {/* 🔍 SEARCH BAR */}
      <input
        type="text"
        placeholder="Search for dishes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      />

      {/* 🧭 CATEGORY TABS */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "8px 15px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background:
                activeCategory === cat ? "#ff4d4d" : "#e0e0e0",
              color: activeCategory === cat ? "white" : "#333",
              fontWeight: "500",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🍽 DISH CARDS */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {filteredDishes.length === 0 ? (
          <p>No dishes found 😢</p>
        ) : (
          filteredDishes.map((item, index) => (
            <div
              key={index}
              style={{
                width: "230px",
                borderRadius: "12px",
                overflow: "hidden",
                background: "white",
                boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                transition: "0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "12px" }}>
                <h3 style={{ margin: "5px 0" }}>{item.name}</h3>

                <p style={{ color: "#666", marginBottom: "10px" }}>
                  {item.price}
                </p>

                <button
                  onClick={() => addToCart(item)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#ff4d4d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;