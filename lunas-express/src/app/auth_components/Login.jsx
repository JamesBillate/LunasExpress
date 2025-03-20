const labels = " text-sm";
const fields = " pl-2 p-2 mb-3 border-1 rounded-md";
const global = " w-[100%]";

export default function Login() {
  return (
    <>
      <form>
        <h1 className="mb-2 text-2xl font-semibold">Login</h1>
        <label className={global + labels}>Username</label>
        <input className={global + fields} type="text"></input>
        <label className={global + labels}>Password</label>
        <input className={global + fields} type="password"></input>
        <div className={global + " mb-4 text-xs text-right cursor-pointer"}>
          Forgot password?
        </div>
        {/* Username Sign In */}
        <button
          className={
            global +
            " pl-2 p-2 cursor-pointer back rounded-sm bg-blue-800 text-gray-100"
          }
          type="submit"
        >
          Sign In
        </button>
        <div className="flex justify-center mt-2">
          {/* Google Sign In */}
          <button
            className={
              "p-2 w-[40px] bg-red-800 text-gray-50 rounded-[50%] text-center cursor-pointer"
            }
            type="submit"
          >
            G
          </button>
        </div>
      </form>

      {/* Sign up section access */}
      <div className={global + " mt-7 text-xs text-center cursor-pointer"}>
        No account?{" "}
        <span className="cursor-pointer text-blue-800 font-semibold">
          Sign Up
        </span>
      </div>
    </>
  );
}
