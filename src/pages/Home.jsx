import React from "react";
import menuItems from "../menuData";

const Home = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Explore Menu</h1>

      <input
        type="text"
        placeholder="Search for dishes..."
        style={{
          width: "100%",
          padding: "10px",
          margin: "15px 0",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px"
      }}>
        {menuItems.map((item) => (
          <div key={item.id} style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "15px",
            textAlign: "center"
          }}>
            <img src={item.image} alt={item.name} width="100%" />
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>

            <button style={{
              background: "#ff4d4d",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "6px",
              cursor: "pointer"
            }}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;