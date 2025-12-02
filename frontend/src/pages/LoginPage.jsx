import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "../components/Form";

const LoginPage = () => {
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    // 登录成功后跳转到学生仪表板
    navigate("/dashboard", { state: { from: '/login' } });
  };

  return <Form route="/api/token/" method="login" onSuccess={handleLoginSuccess} />;
};

export default LoginPage;

