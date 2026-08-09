import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_API_BASE_URL;

const Header = ({ session }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await axios.post(`${BASE}/sheet/logout.php`, {}, { withCredentials: true });
    localStorage.clear();
    navigate("/");
  };

  if (!session) return <p style={{ padding: "20px", textAlign: "center", color: "#666880" }}>Loading...</p>;
  const { centre } = session;

  return (
    <div className="header-container" style={{ background: "#F6F7FB", padding: "0 0 16px 0" }}>
      {/* Brand Navy Top Header Bar */}
      <div
        style={{
          background: "#29377D",
          color: "#FFFFFF",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 6px rgba(41, 55, 125, 0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <i className="fa-solid fa-hospital-user" style={{ fontSize: "20px", color: "#EEF0F8" }}></i>
          <h1
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.3px",
              color: "#FFFFFF",
            }}
          >
            {centre}
          </h1>
        </div>

        {/* Subtle Logout Button (Red is pulled back from logout!) */}
        <button
          onClick={handleLogout}
          style={{
            padding: "6px 14px",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.35)",
            background: "rgba(255, 255, 255, 0.1)",
            color: "#FFFFFF",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "13px",
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
        >
          <i className="fa-solid fa-right-from-bracket" style={{ fontSize: "12px" }}></i>
          Logout
        </button>
      </div>

      {/* Page Title Below Header Bar */}
      <div style={{ padding: "16px 24px 0 24px" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            color: "#29377D",
          }}
        >
          Dialysis Centre Dashboard
        </h2>
      </div>
    </div>
  );
};

export default Header;