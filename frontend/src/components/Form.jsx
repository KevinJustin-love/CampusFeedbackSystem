import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";

import "../styles/Form.css";
import "../styles/form&submitIssuePage.css"

const Form = ({ route, method }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";
  const title = method === "login" ? "校园反馈系统登录" : "校园反馈系统注册";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        // 解码JWT Token获取用户角色
        const decodedToken = jwtDecode(res.data.access);
        const role = decodedToken.role || "student";

        // 根据角色决定导航路径
        if (role.includes("admin")) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  // 处理注册按钮点击
  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img
            src="../../pictures/ustcLogo.jpg"
            alt="School Logo"
            className="logo"
          />
        </div>
        <h2 className="login-title">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group-no-label">
            <div className="input-with-icon">
              <span className="input-icon user-icon">👤</span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input-large"
                placeholder="Username"
                required
              />
            </div>
          </div>
          <div className="form-group-no-label">
            <div className="input-with-icon">
              <span className="input-icon password-icon">🔒</span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input-large"
                placeholder="Password"
                required
              />
            </div>
          </div>
          <div className="button-container">
            {/* 只在登录页面显示Register按钮 */}
            {method === "login" && (
              <button
                type="button"
                className="btn-primary1"  
                onClick={handleRegisterClick}
                style={{ marginRight: "10px" }}
              >
                Register
              </button>
            )}
            <button
              type="submit"
              className="btn-primary1"
              disabled={loading}
            >
              {loading ? "处理中..." : name}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
