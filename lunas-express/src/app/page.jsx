import Login from "./auth_components/Login.jsx";
import SignUp from "./auth_components/Signup.jsx";
import ForgotPW from "./auth_components/ForgotPW.jsx";

export default function Home() {
  return (
    <>
      <SignUp />
      <Login />
      <ForgotPW />
    </>
  );
}
