import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    const existing = cart.find((i) => i.name === item.name);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.name === item.name
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (name) => {
    setCart(cart.filter((item) => item.name !== name));
  };

  const increaseQty = (name) => {
    setCart(
      cart.map((item) =>
        item.name === name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (name) => {
    setCart(
      cart
        .map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <Router>
      <Navbar cartCount={cart.length} />

      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/menu" element={<Menu addToCart={addToCart} />} />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;