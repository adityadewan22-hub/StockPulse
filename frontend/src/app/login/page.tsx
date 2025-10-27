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
      const path = localStorage.getItem("redirectLogin") || "/";
      localStorage.removeItem("redirectLogin");
      router.push("/");
    } catch (err: any) {
      console.log("couldnt login", err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 p-6 bg-white rounded shadow-md text-black"
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
          className="bg-blue-500 text-white p-2 rounded mt-2"
        >
          Login
        </button>
        <p>
          Don't have an account?
          <span
            onClick={() => router.push("/register")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
