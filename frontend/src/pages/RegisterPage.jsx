import React from "react";
import Form from "../components/Form"

const RegisterPage = () => {
    return <Form route="/api/auth/register/" method="register" />
}

export default RegisterPage;