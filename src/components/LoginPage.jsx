import React, { useState } from "react";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username, password, rememberMe });
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
          <button type="submit" className="btn-primary">
            登录
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
