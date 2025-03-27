"use client";

import AuthForm from "../AuthForm";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/config";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");

  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

  const handleSignUp = async () => {
    if (password !== reEnterPassword) {
      console.error("Passwords do not match!");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log("User created:", res);
      
      // Reset form fields
      setEmail("");
      setPassword("");
      setReEnterPassword("");
    } catch (e) {
      console.error("Error signing up:", e);
    }
  };

  return (
    <>
      <AuthForm
        title="Sign Up"
        buttonText={loading ? "Signing Up..." : "Sign Up"}
        authMode="signup"
        formState={{
          email,
          setEmail,
          password,
          setPassword,
          reEnterPassword,
          setReEnterPassword,
          onSubmit: handleSignUp,
        }}
        errorMessage={error ? error.message : ""}
      />
    </>
  );
}