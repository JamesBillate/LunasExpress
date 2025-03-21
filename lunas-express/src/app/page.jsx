import Login from "./auth_components/Login.jsx";
import SignUp from "./auth_components/Signup.jsx";

export default function Home() {
  return (
    <>
      <SignUp />
      <Login />
    </>
  );
}
