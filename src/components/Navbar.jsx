import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg"; // ✅ correct path

function Navbar({ cart = [] }) {
  return (
    <div
      style={{
        padding: "10px 20px",
        backgroundColor: "#ff4d4d",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* 🔥 LOGO IMAGE */}
      <img
        src={logo}
        alt="Foodie"
        style={{
          height: "45px",
          objectFit: "contain",
          cursor: "pointer",
        }}
      />

      {/* NAV LINKS */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link style={{ color: "white" }} to="/">Home</Link>
        <Link style={{ color: "white" }} to="/menu">Menu</Link>
        <Link style={{ color: "white" }} to="/cart">
          Cart ({cart.length})
        </Link>
      </div>
    </div>
  );
}

export default Navbar;