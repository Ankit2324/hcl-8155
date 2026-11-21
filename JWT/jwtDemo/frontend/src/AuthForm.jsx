import api from "./api";
import SubmitButton from "./SubmitButton";
import { useState, useActionState } from "react";

const AuthForm = ({ onLogin }) => {
  const [mode, setMode] = useState("login");

  const submitAction = async (prevState, formData) => {
    const username = formData.get("username")?.trim();
    const password = formData.get("password")?.trim();

    if (!username || !password) {
      return {
        error: "Username and password are required",
        msg: "",
        username: username || "",
      };
    }

    try {
      if (mode === "register") {
        await api.post("/auth/register", { username, password });

        setMode("login");

        return {
          error: null,
          msg: "Registration successful! Please login.",
          username,
        };
      }

      const { data } = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);

      onLogin(username);

      return {
        error: null,
        msg: "",
        username: data.username,
      };
    } catch (error) {
      return {
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        msg: "",
        username,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    submitAction,
    {
      error: null,
      msg: "",
      username: "",
    }
  );

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Heading */}
        <div className="text-center mb-7">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-300/40">
            <span className="text-white text-3xl font-bold">J</span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome to JWT Blog
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Login or create an account to continue
          </p>
        </div>

        {/* Login/Register Trigger */}
        <div className="bg-gray-100 p-1.5 rounded-xl flex mb-6">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setMode("login")}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
              mode === "login"
                ? "bg-white text-indigo-600 shadow-md"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => setMode("register")}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
              mode === "register"
                ? "bg-white text-indigo-600 shadow-md"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form
          action={formAction}
          className="bg-white p-7 sm:p-8 rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 space-y-5"
        >
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {mode === "login" ? "Login to your account" : "Create your account"}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {mode === "login"
                ? "Enter your credentials below."
                : "Fill in your details to get started."}
            </p>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-semibold text-gray-700"
            >
              Username
            </label>

            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              defaultValue={state.username}
              required
              disabled={isPending}
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700"
            >
              Password
            </label>

            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              required
              disabled={isPending}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Submit */}
          <SubmitButton
            text={mode === "login" ? "Login to Account" : "Create Account"}
          />

          {/* Messages */}
          {state.msg && (
            <p
              role="status"
              className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm"
            >
              ✓ {state.msg}
            </p>
          )}

          {state.error && (
            <p
              role="alert"
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
            >
              {state.error}
            </p>
          )}
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Secure authentication powered by JWT
        </p>
      </div>
    </div>
  );
};

export default AuthForm;