"use client";
import axios from "axios";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  //we need state, handle and reutrn;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  console.log(API_URL);

  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token } = res.data;
      localStorage.setItem("token", token);
      const path = localStorage.getItem("redirectLogin") || "/dashboard";
      localStorage.removeItem("redirectLogin");
      router.push(path);
    } catch (err: any) {
      console.log("couldnt login", err.message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-purple-700/20 to-black blur-3xl pointer-events-none"></div>
      <div className="flex justify-center items-center h-screen ">
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 p-6 bg-gray-400 rounded shadow-md text-black"
        >
          <h2 className="text-2xl font-bold mb-2">Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 p-2 rounded bg-gray-100"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 p-2 rounded bg-gray-100"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded mt-2"
          >
            Login
          </button>
          <p>
            Don't have an account?
            <span
              onClick={() => router.push("/register")}
              className="text-green-200 cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
