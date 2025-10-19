"use client";
import axios from "axios";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "../background.css";

const Login = () => {
  //we need state, handle and reutrn;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      const { token } = res.data;
      localStorage.setItem("token", token);
      router.push("/");
    } catch (err: any) {
      console.log("couldnt login", err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen background-div">
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
      </form>
    </div>
  );
};

export default Login;
