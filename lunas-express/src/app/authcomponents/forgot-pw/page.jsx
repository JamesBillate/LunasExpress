"use client";

import AuthForm from "../AuthForm";
import { useState } from "react";

export default function ForgotPW() {
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");

  const forgotPWState = {
    password,
    setPassword,
    reEnterPassword,
    setReEnterPassword,
  };

  //Forgot PW Firebase must be here

  return (
    <>
      <AuthForm
        title="Forgot Password"
        buttonText="Submit"
        authMode="forgotpw"
        formState={forgotPWState}
      />
    </>
  );
}
