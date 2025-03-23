"use client";

import AuthForm from "../AuthForm";
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");

  const signupState = {
    email,
    setEmail,
    password,
    setPassword,
    reEnterPassword,
    setReEnterPassword,
  };

  //Sign Up Firebase must be here

  return (
    <>
      <AuthForm
        title="Sign Up"
        buttonText="Sign Up"
        authMode="signup"
        formState={signupState}
      />
    </>
  );
}
