import EntryField, { Button } from "./AuthFields";

export default function AuthForm({ title, buttonText, authMode }) {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="px-10 py-12 bg-blue-300 w-[25rem] rounded-xl">
          <form className="grid">
            <h1 className="text-2xl font-bold">{title}</h1>
            {authMode === "login" || authMode === "signup" ? (
              <EntryField
                type="text"
                label="Email"
                placeholder="you@example.com"
              />
            ) : (
              ""
            )}
            <EntryField
              type="password"
              label="Password"
              placeholder="Enter 6 characters or more"
            />
            {authMode === "signup" || authMode === "forgotpw" ? (
              <EntryField
                type="password"
                label="Re-enter Password"
                placeholder="Enter 6 characters or more"
              />
            ) : (
              ""
            )}
            {authMode === "login" && (
              <div className="mt-2 text-right text-sm cursor-pointer">
                <span>Forgot password?</span>
              </div>
            )}
            <div className="p-2"></div>
            <Button type="submit" label={buttonText} color="bg-blue-600" />
            {authMode === "login" || authMode === "signup" ? (
              <Button type="button" label="Google" color="bg-red-600" />
            ) : (
              ""
            )}
            {authMode === "signup" && (
              <div className="mt-10 text-center text-sm">
                Already have an account?
                <span className="font-semibold cursor-pointer"> Login</span>
              </div>
            )}
            {authMode === "login" && (
              <div className="mt-10 text-center text-sm">
                Dont have an account?
                <span className="font-semibold cursor-pointer"> Sign Up</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
