import React, { useState, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";

import "../styles/Form.css";

import dovelinkLogo from "../../pictures/dovelink-logo.jpg";

const Form = ({ route, method }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [invitationMessage, setInvitationMessage] = useState("");
  const [invitationValid, setInvitationValid] = useState(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  // 验证邀请码函数
  const validateInvitationCode = async (code) => {
    if (!code.trim()) {
      setInvitationMessage("");
      setInvitationValid(null);
      return;
    }

    try {
      const res = await api.post("/api/validate-invitation-code/", { code });
      setInvitationMessage(res.data.message);
      setInvitationValid(res.data.valid);
    } catch (error) {
      const errorData = error.response?.data || {};
      setInvitationMessage(errorData.message || "验证邀请码时出错");
      setInvitationValid(false);
    }
  };

  // 处理邀请码输入变化
  const handleInvitationCodeChange = (e) => {
    const code = e.target.value.toUpperCase(); // 转换为大写
    setInvitationCode(code);
    
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // 延迟验证，避免频繁请求
    timeoutRef.current = setTimeout(() => {
      validateInvitationCode(code);
    }, 500);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      // 构建请求数据
      const requestData = { username, password };
      if (method === "register" && invitationCode.trim()) {
        requestData.invitation_code = invitationCode.trim();
      }

      const res = await api.post(route, requestData);
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        // 解码JWT Token获取用户角色
        const decodedToken = jwtDecode(res.data.access);
        const roles = decodedToken.roles || [];

        // 根据角色决定导航路径
        const isAdmin =
          roles.includes("super_admin") ||
          roles.some((role) => role.endsWith("_admin"));
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/", { state: { from: "/login" } });
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

  // 处理登录按钮点击
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand">
          <div className="brand-zh">多闻林</div>
          <div className="brand-en">DoveLink</div>
        </div>
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
          
          {/* 邀请码输入框 - 仅在注册时显示 */}
          {method === "register" && (
            <div className="form-group-no-label">
              <div className="input-with-icon">
                <span className="input-icon key-icon">🔑</span>
                <input
                  type="text"
                  id="invitationCode"
                  value={invitationCode}
                  onChange={handleInvitationCodeChange}
                  className="form-input-large"
                  placeholder="管理员邀请码（可选）"
                />
              </div>
              {/* 邀请码验证消息 */}
              {invitationMessage && (
                <div className={`invitation-message ${invitationValid ? 'success' : 'error'}`}>
                  {invitationMessage}
                </div>
              )}
            </div>
          )}
          
          <div className="button-container vertical">
            <button type="submit" className="btn-primary1" disabled={loading}>
              {loading ? "处理中..." : method === "login" ? "登录" : "注册"}
            </button>
            {method === "login" && (
              <button
                type="button"
                className="register-link"
                onClick={handleRegisterClick}
              >
                还没有账户？立即注册
              </button>
            )}
            {method === "register" && (
              <button
                type="button"
                className="register-link"
                onClick={handleLoginClick}
              >
                已经有账户？点击登录
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
