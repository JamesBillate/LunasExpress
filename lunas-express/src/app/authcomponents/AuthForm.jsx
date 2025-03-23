import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

import EntryField, { Button } from "./AuthFields";

export default function AuthForm({ title, buttonText, authMode, formState }) {
  const router = useRouter();
  //This is the main component for the AuthForm in Login, Signup and Forgot Password
  return (
    <>
      <div className="flex justify-end items-center h-screen">
        <div className="mr-[20vh] px-10 py-12 bg-gray-100 w-[25rem] rounded-xl shadow-lg">
          <form className="grid">
            <h1 className="text-2xl font-bold">{title}</h1>
            {/* Login and Signup Username */}
            {authMode === "login" || authMode === "signup" ? (
              <EntryField
                type="text"
                label="Email"
                placeholder="you@example.com"
                onChange={(e) => formState.setEmail(e.target.value)}
                value={formState.email}
              />
            ) : (
              ""
            )}
            {/* Regular Password Field for all AuthForms */}
            <EntryField
              type="password"
              label="Password"
              placeholder="Enter 6 characters or more"
              onChange={(e) => formState.setPassword(e.target.value)}
              value={formState.password}
            />
            {/* For Signup and Forgot Password */}
            {authMode === "signup" || authMode === "forgotpw" ? (
              <EntryField
                type="password"
                label="Re-enter Password"
                placeholder="Enter 6 characters or more"
                onChange={(e) => formState.setReEnterPassword(e.target.value)}
                value={formState.reEnterPassword}
              />
            ) : (
              ""
            )}
            {/* For Login AuthForm */}
            {authMode === "login" && (
              <div className="mt-2 text-right text-sm cursor-pointer">
                <Link href="/forgotpw"> Forgot password?</Link>
              </div>
            )}
            <div className="p-2"></div>
            <Button
              type="submit"
              label={buttonText}
              color="bg-blue-600 text-gray-50"
            />
            {authMode === "login" || authMode === "signup" ? (
              <Button
                type="button"
                color="bg-gray-300 text-black"
                label={
                  <>
                    Continue with <FcGoogle />
                  </>
                }
              />
            ) : (
              ""
            )}
            {/* For SignUp AuthForm */}
            {authMode === "signup" && (
              <div className="mt-10 text-center text-sm">
                Already have an account?
                <Link className="font-semibold cursor-pointer" href="/login">
                  {" "}
                  Log In
                </Link>
              </div>
            )}
            {authMode === "login" && (
              <div className="mt-10 text-center text-sm">
                Dont have an account?
                <Link className="font-semibold cursor-pointer" href="/signup">
                  {" "}
                  Sign Up
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
