import AuthForm from "./AuthForm";

export default function ForgotPW() {
  return (
    <>
      <AuthForm
        title="Forgot Password"
        buttonText="Submit"
        authMode="forgotpw"
      />
    </>
  );
}
