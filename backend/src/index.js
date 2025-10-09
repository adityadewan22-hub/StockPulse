import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/stockRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/",(req,res)=>{res.send("backend active")});

app.use("/api/stocks", router); 


app.listen(5000,()=>console.log("server running on port 5000"));


