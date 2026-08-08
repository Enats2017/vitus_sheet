import React, { useState } from "react";
import "./logincard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BASE = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE}/sheet/login.php`,
        { username, password },
        { withCredentials: true },
      );

      if (res.data.status === "success") {
        localStorage.setItem("loginData", JSON.stringify(res.data)); // ← ONLY CHANGE
        navigate("/dashboard");
      } else {
        setError(res.data.message);
        console.log("Error:", res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div style={{ width: "350px" }} className="card">
        <div className="icon">
          <FontAwesomeIcon icon={faUser} />
        </div>

        <h2 style={{ color: "#ffffff" }}>Welcome back</h2>
        <p style={{ marginTop: "15px", color: "#ffffff" }}>
          Sign in to your account to continue
        </p>

        

        <div className="input-group">
          <label style={{ color: "#ffffff" }}>USERNAME</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label style={{ color: "#ffffff" }}>PASSWORD</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} />
            </span>
          </div>
        </div>

        <button className="btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;