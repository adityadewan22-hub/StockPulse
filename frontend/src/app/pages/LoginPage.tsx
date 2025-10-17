import axios from "axios";
import React, { FormEvent, useState } from "react";

const login = () => {
  //we need state, handle and reutrn;
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
    } catch (err: any) {
      console.log("couldnt login", err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="Password"
          value={email}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </form>
    </div>
  );
};

export default login;
