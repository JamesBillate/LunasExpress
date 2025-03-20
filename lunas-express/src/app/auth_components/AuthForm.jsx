"use client";

import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import { useState } from "react";

export default function Authform() {
  const [authType, setAuthType] = useState("signup");

  const renderAuthForm = () => {
    switch (authType) {
      case "login":
        return <Login />;
      case "signup":
        return <SignUp />;
      default:
        return <Login />;
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="w-[50vh] bg-gray-200 p-10 rounded-md mt-[15vh]">
          {renderAuthForm()}
        </div>
      </div>
    </>
  );
}
