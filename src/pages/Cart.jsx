function Cart({ cart, removeFromCart, increaseQty, decreaseQty }) {
  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price = Number(item.price.replace("₹", "")) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Cart Page</h2>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: "15px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "10px",
              }}
            >
              <h3>{item.name}</h3>
              <p>{item.price}</p>

              {/* Quantity */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => decreaseQty(item.name)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item.name)}>+</button>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.name)}
                style={{
                  marginTop: "10px",
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <h3>Total: ₹{getTotal()}</h3>
        </>
      )}
    </div>
  );
}

export default Cart;