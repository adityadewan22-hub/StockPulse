import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();
connectDB();

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.cookieParser?.());
app.get("/",(req,res)=>{res.send("backend active")});
app.listen(5000,()=>console.log("server running on port 5000"));


