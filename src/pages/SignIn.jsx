import { Loader, Mail } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SocialAuthButton from "../components/auth/SocialAuthButton";
import { motion } from "framer-motion";
import PasswordField from "../components/auth/PasswordField";
import { Link, useNavigate } from "react-router-dom";
import AnimatedInput from "../components/auth/AnimatedInput";
import { toast } from "react-toastify";
import { loginUser } from "../redux/features/authThunks";
import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const dispatch=useDispatch()

  const wrapperRef = useRef(null);
  const passRef = useRef(null);
  const socialProviders = [
    {
      id: "google",
      icon: "/images/Auth/google.png",
      alt: "Google login",
      onClick: () => console.log("Google Login"),
    },
    {
      id: "github",
      icon: "/images/Auth/github.png",
      alt: "GitHub login",
      onClick: () => console.log("GitHub Login"),
    },
    {
      id: "facebook",
      icon: "/images/Auth/facebook.png",
      alt: "Facebook login",
      onClick: () => console.log("Facebook Login"),
    },
  ];
  const [isSubmitting, setIsSubmitting]=useState(false)
  const navigate=useNavigate()

  const handleFocus = (ref) => {
    ref.current?.classList.add(
      "border-[#01509C]",
      "ring-2",
      "ring-[#01509C]/30",
    );
  };
  const handleBlur = (ref) => {
    ref.current?.classList.remove(
      "border-[#01509C]",
      "ring-2",
      "ring-[#01509C]/30",
    );
  };
  const onSubmit = async (data) => {
     try {
      setIsSubmitting(true)
       const res = await dispatch(loginUser(data)).unwrap();
       console.log(res);
       
 
       toast.success(`Welcome Back ${res?.user?.name}!!`);
 
       switch (res?.user?.role) {
         case "Admin":
           navigate("/admin");
           break;
         case "Co-Admin":
           navigate("/co-admin");
           break;
         default:
           navigate("/user-dashboard");
       }
     } catch (err) {
       toast.error(err || "Registration failed");
     }finally{
      setIsSubmitting(false)
     }
   };
 
   const onError = (errors) => {
     setIsSubmitting(false);
     const firstError = Object.values(errors)[0];
 
     if (firstError?.message) {
       toast.error(firstError.message);
     } else {
       toast.error("Please fix the form errors");
     }
 
     console.log(errors);
   };
 
 return (
  <div className="w-full h-screen bg-black flex items-center justify-center">

    {/* MAIN WHITE CONTAINER */}
    <div className="w-[95%] h-[90%] bg-white dark:bg-[#0F172A] rounded-3xl flex overflow-hidden relative">

      {/* LEFT SIDE */}
      <div className="w-[45%] bg-[#1E4D7B] relative flex items-center justify-center">

        {/* CURVE */}
        <div className="absolute right-0 top-0 w-[70%] h-full bg-white dark:bg-[#0F172A] rounded-l-[100px]"></div>

        {/* IMAGE */}
        <img
  src="/images/Auth/loginHuman.png"
  alt="login"
  className="w-[420px] lg:w-[500px] z-10 scale-x-[-1]"
/>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full flex flex-col items-center max-w-md space-y-5">

        <form onSubmit={handleSubmit(onSubmit, onError)} className="w-[380px] space-y-6 mt-4">

          <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
            Welcome Back
          </h1>

          {/* EMAIL */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">📧</span>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 px-4 py-3 pl-10 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none"
              {...register("email", { required: "Email is required" })}
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔒</span>
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 px-4 py-3 pl-10 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password", { required: "Password is required" })}
            />
          </div>

          <p className="text-sm text-right text-blue-500 cursor-pointer">
            Forgot Password?
          </p>

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 rounded-md shadow-md disabled:opacity-50">
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>

          <div className="flex items-center my-6">
  <div className="flex-grow h-px bg-gray-300"></div>
  <span className="mx-4 text-sm text-gray-400">Or continue with</span>
  <div className="flex-grow h-px bg-gray-300"></div>
</div>

<div className="flex justify-center gap-4 mb-4">
  <button className="border p-2 rounded-md hover:shadow">
    <FcGoogle size={20} />
  </button>
  <button className="border p-2 rounded-md hover:shadow">
    <FaGithub size={20} />
  </button>
  <button className="border p-2 rounded-md hover:shadow">
    <FaFacebook size={20} className="text-blue-600" />
  </button>
</div>

          <p className="text-center text-sm text-gray-500">
            Don’t have an account? <span className="text-blue-500">Sign Up</span>
          </p>

        </form>
      </div>

    </div>
  </div>
);
};

export default SignIn;
