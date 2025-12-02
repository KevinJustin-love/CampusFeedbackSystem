import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "../components/Form";

const LoginPage = () => {
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    // 登录成功后跳转到首页，并标记来源为login
    navigate("/", { state: { from: '/login' } });
  };

  return <Form route="/api/token/" method="login" onSuccess={handleLoginSuccess} />;
};

export default LoginPage;

