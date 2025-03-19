const global = " w-[100%]";
const labels = " text-sm";
const fields = " pl-2 p-2 mb-3 border-1 rounded-md";

export default function Login() {
  return (
    <>
      <div className="flex justify-center">
        <div className="w-[60vh] bg-gray-200 p-10 rounded-md mt-[15vh]">
          <form>
            <h1 className="mb-2 text-2xl font-semibold">Login</h1>
            <label className={global + labels}>Username</label>
            <input className={global + fields} type="text"></input>
            <label className={global + labels}>Password</label>
            <input className={global + fields} type="password"></input>
            <div className={global + " mb-4 text-xs text-right cursor-pointer"}>
              Forgot password?
            </div>
            <button
              className={
                global +
                " pl-2 p-2 cursor-pointer back rounded-sm bg-blue-800 text-gray-100"
              }
              type="submit"
            >
              Sign In
            </button>
          </form>
          <div className={global + " mt-7 text-xs text-center cursor-pointer"}>
            No account?{" "}
            <span className="cursor-pointer text-blue-800 font-semibold">
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
