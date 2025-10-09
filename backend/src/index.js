import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/stockRoutes.js";
import { Server } from "socket.io";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const io=new Server(server,{
    cors:{origin:"*"},
});

app.get("/",(req,res)=>res.send("StockPulse Websocket Server Running"));

io.on("connection",(socket)=>{
    console.log("client connected:",socket.id);

socket.on("subscribeToStock",(symbol)=>{
    console.log("Subscribe to:",symbol);

const interval =setInterval(async()=>{
    try{
        const {data}= await axios.get(
            `https://www.alphavantage.co/query`,
            {params: {function:"GLOBAL_QUOTE",symbol,apikey:process.env.ALPHA_VANTAGE_KEY}}
        )
    }
    catch(err){
        console.error("Error fetching stock", err.message);
    }
},1000);
  socket.on("disconnect",()=> clearInterval(interval));
})
});

app.get("/",(req,res)=>{res.send("backend active")});

app.use("/api/stocks", router); 


app.listen(5000,()=>console.log("server running on port 5000"));


