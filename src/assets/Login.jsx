import React from "react";
import { useForm } from "react-hook-form";
import googleLogo from "../assets/google-icon-logo-svgrepo-com.svg";
import API from "./api.js";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Register from './Register';

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const {setUser} = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await API.post("/auth/login", data);
      console.log(response.data);
      setUser(response.data)
      reset();
      navigate('/')
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        console.log("Error response:", error.response?.data);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
        <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-8 sm:p-10 text-center">
          {/* Header */}
          <div className="mt-10">
            <h1 className="text-3xl font-semibold">Welcome back to <span className="text-purple-600 font-bold">Eventify</span></h1>
            <p className="text-gray-400">Join back and make fun</p>
          </div>

          {/* Form Section */}
          <div className="my-6">
            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <input
                className="border-[2px] hover:border-purple-500 rounded-2xl py-2 px-4 mb-4"
                type="text"
                autoComplete="off"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.email.message}
                </p>
              )}

              {/* Password Field */}
              <input
                className="border-[2px] hover:border-purple-500 rounded-2xl py-2 px-4 mb-4"
                type="password"
                autoComplete="new-password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.password.message}
                </p>
              )}

              <p className="text-purple-400 hover:text-purple-500 font-bold cursor-pointer">
                Forgot password?
              </p>

              {/* Login Button */}
              <button
                disabled={isSubmitting}
                className="w-full text-white py-2 rounded-3xl bg-purple-500 hover:bg-purple-600 mt-4"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              {/* Divider */}
              <div className="flex items-center justify-between my-6">
                <div className="flex-1 border-t border-gray-400"></div>
                <span className="mx-2 font-bold text-gray-400">OR</span>
                <div className="flex-1 border-t border-gray-400"></div>
              </div>
            </form>

            {/* Google Login Button */}
           <a href="http://localhost:5000/api/auth/google" className="flex items-center justify-center gap-3 w-full border border-gray-300 py-2 rounded-3xl font-bold hover:bg-gray-100 transition">
           <img src={googleLogo} alt="Google logo" className="w-6 h-6" />
           <p className="font-semibold">Continue with Google</p>
            </a>

            {/* Register Link */}
            <p className="text-gray-400 mt-4">
              Don't have an account?{" "}
              <span
              onClick={()=> navigate("/Register")} className="text-purple-500 hover:text-purple-600 font-bold cursor-pointer">
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
