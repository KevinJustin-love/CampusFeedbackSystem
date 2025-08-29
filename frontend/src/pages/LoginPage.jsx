import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // 导入 jwt-decode

const LoginPage = ({}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. 向JWT的认证接口发送POST请求，获取令牌
      const response = await axios.post("http://localhost:8000/api/token/", {
        username,
        password,
      });

      // 2. 登录成功，将获取到的令牌（token）存储到localStorage
      // JWT认证的核心在于此步骤
      const accessToken = response.data.access;
      localStorage.setItem("access_token", accessToken);

      // 3. 设置axios的默认请求头，以便后续请求自动携带令牌
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // 解码 JWT 令牌以获取用户角色
      const decodedToken = jwtDecode(accessToken);
      const userRole = decodedToken.role; // <-- 从令牌中提取角色

      setMessage("登录成功！");
      console.log("登录成功，角色为:", userRole);

      // 根据角色进行页面跳转
      if (userRole === "student") {
        navigate("/dashboard");
      } else {
        navigate("/admin");
      }
      
    } catch (error) {
      // 登录失败，显示错误信息
      if (error.response) {
        setMessage(error.response.data.detail || "用户名或密码错误");
      } else {
        setMessage("网络错误，请稍后重试");
      }
      console.error("登录失败：", error.response);
    }
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
        <h2 className="login-title">校园反馈系统登录</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              用户名
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="checkbox"
            />
            <label htmlFor="rememberMe" className="checkbox-label">
              记住我
            </label>
          </div>
          <button type="submit" className="btn-primary1">
            登录
          </button>
        </form>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
