"use client";

import AuthForm from "../AuthForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUpload } from "react-icons/fa6";

// Firebase imports
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  // Sign in with google
  const handleGoogleLogin = async () => {
    if (typeof window === "undefined") return; // Prevents SSR issues

    try {
      const res = await signInWithPopup(auth, provider);
      console.log("Google Sign-In Successful:", res);

      if (res.user) {
        console.log("User Info:", res.user);
        router.push("/home"); // Redirect after successful sign-in
      }
    } catch (e) {
      console.error("Error with Google Sign-In:", e);
    }
  };

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  const loginState = {
    email,
    setEmail,
    password,
    setPassword,
    onSubmit: async () => {
      try {
        const res = await signInWithEmailAndPassword(email, password);
        console.log("User logged in:", res);
        if (res) router.push("/home");
      } catch (e) {
        console.error("Error logging in:", e);
      }
    },
    onGoogleSubmit: handleGoogleLogin, // Pass correct Google login function
  };

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
