import { useRouter } from "next/navigation";
import { routes } from "../routes";

import EntryField, { Button } from "./AuthFields";

export default function AuthForm({ title, buttonText, authMode, formState }) {
  const router = useRouter();
  //This is the main component for the AuthForm in Login, Signup and Forgot Password
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="px-10 py-12 bg-blue-300 w-[25rem] rounded-xl">
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
                <a onClick={() => router.push(routes.ForgotPW)}>
                  {" "}
                  Forgot password?
                </a>
              </div>
            )}
            <div className="p-2"></div>
            <Button type="submit" label={buttonText} color="bg-blue-600" />
            {authMode === "login" || authMode === "signup" ? (
              <Button type="button" label="Google" color="bg-red-600" />
            ) : (
              ""
            )}
            {/* For SignUp AuthForm */}
            {authMode === "signup" && (
              <div className="mt-10 text-center text-sm">
                Already have an account?
                <a
                  className="font-semibold cursor-pointer"
                  onClick={() => router.push(routes.Login)}
                >
                  {" "}
                  Log In
                </a>
              </div>
            )}
            {authMode === "login" && (
              <div className="mt-10 text-center text-sm">
                Dont have an account?
                <a
                  className="font-semibold cursor-pointer"
                  onClick={() => router.push(routes.SignUp)}
                >
                  {" "}
                  Sign Up
                </a>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
