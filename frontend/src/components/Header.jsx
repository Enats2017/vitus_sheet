import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_API_BASE_URL;

const Header = ({session}) => {
  
  const navigate = useNavigate();
  const handleLogout = async () => {
    await axios.post(`${BASE}/sheet/logout.php`, {}, { withCredentials: true });
    localStorage.clear();   // instead of removeItem
    navigate("/");
  };

  

  if (!session) return <p>Loading...</p>;
  const { centre, user } = session;
  return (
    <>
      <div className="header" style={{ position: "relative" }}>
        <h1
          style={{
            background: "linear-gradient(135deg, #1e1b5e, #2a2470)",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          {centre}
        </h1>
        <h2>Dialysis Centre Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            right: "2vw", // responsive instead of 20px
            top: "2vh", // responsive instead of 20px
            padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)",
            borderRadius: "8px",
            border: "none",
            background: "#e02020",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "clamp(10px, 1.5vw, 14px)", // responsive text
            marginTop: "17px",  
            marginRight:"20px"
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Header;