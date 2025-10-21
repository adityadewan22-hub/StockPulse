"use client";
import { useState } from "react";
import axios from "axios";
import "../background.css";
import { useRouter } from "next/navigation";

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleRegister = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        username,
      });
      const { token } = res.data;
      localStorage.setItem("token", token);
      router.push("/login");
    } catch (err: any) {
      console.log("registeration failed", err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 background-div">
      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4 p-6 bg-white rounded shadow-md text-black"
      >
        <h2 className="text-2xl font-bold mb-2">Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-400 p-2 rounded bg-gray-100"
        ></input>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-400 p-2 rounded bg-gray-100"
        ></input>
        <input
          type="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-400 p-2 rounded bg-gray-100"
        ></input>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mt-2"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default register;
