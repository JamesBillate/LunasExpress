"use client";

import AuthForm from "../AuthForm";
import { useState } from "react";
import { auth } from "../../firebase/config";
import { updatePassword } from "firebase/auth";

export default function ForgotPW() {
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

//firebase update password
  const handleChangePassword = async () => {
    setError(null);
    setSuccess(null);

    //check if passwords match
    if (password !== reEnterPassword) {
      setError("Passwords do not match.");
      return;
    }

    const user = auth.currentUser; //get current user
    if (!user) {
      setError ("No user is currently signed in.");
      return;
    }

    try {
      await updatePassword(user, password);
      setSuccess("Password changed successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  const forgotPWState = {
    password,
    setPassword,
    reEnterPassword,
    setReEnterPassword,
    onSubmit: handleChangePassword,
  };

  return (
    <>
      <AuthForm
        title="Forgot Password"
        buttonText="Submit"
        authMode="forgotpw"
        formState={forgotPWState}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
    </>
  );
}
