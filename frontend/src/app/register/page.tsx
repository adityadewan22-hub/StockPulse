"use client";
import { useState } from "react";
import axios from "axios";

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const res = await axios.post(
        "http://localhost:5000/api/stocks/register",
        {
          email,
          password,
          username,
        }
      );
      const { token } = res.data;
      localStorage.setItem("token", token);
    } catch (err: any) {
      console.log("registeration failed", err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4 p-6 bg-white rounded shadow-md text-black"
      >
        <h2>Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <input
          type="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
      </form>
    </div>
  );
};

export default register;
