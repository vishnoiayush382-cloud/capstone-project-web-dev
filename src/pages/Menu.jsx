import React, { useState } from "react";
import menuItems from "../menuData";

const Menu = () => {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});

  const handleQty = (id, value) => {
    setQuantities({
      ...quantities,
      [id]: Math.min(5, Math.max(1, value))
    });
  };

  const addToCart = (item) => {
    const qty = quantities[item.id] || 1;

    const existingItem = cart.find((i) => i.id === item.id);

    if (existingItem) {
      const updatedCart = cart.map((i) =>
        i.id === item.id
          ? { ...i, quantity: Math.min(i.quantity + qty, 5) }
          : i
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: qty }]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Menu</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px"
        }}
      >
        {menuItems.map((item) => {
          const qty = quantities[item.id] || 1;

          return (
            <div key={item.id} style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "15px",
              textAlign: "center"
            }}>
              <img src={item.image} alt={item.name} width="100%" />
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>

              <div>
                <button onClick={() => handleQty(item.id, qty - 1)}>-</button>
                <span style={{ margin: "0 10px" }}>{qty}</span>
                <button onClick={() => handleQty(item.id, qty + 1)}>+</button>
              </div>

              <button onClick={() => addToCart(item)}>
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>

      <h2 style={{ marginTop: "20px" }}>
        Cart Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}
      </h2>
    </div>
  );
};

export default Menu;