import React from "react";
import Form from "../components/Form";

const LoginPage = () => {
  return <Form route="/api/token/" method="login" />
};

export default LoginPage;
