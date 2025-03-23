"use client";

import AuthForm from "./AuthForm";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginState = {
    email,
    setEmail,
    password,
    setPassword,
  };

  //Login Firebase must be here

  return (
    <>
      <AuthForm
        title="Login"
        buttonText="Sign In"
        authMode="login"
        formState={loginState}
      />
    </>
  );
}
