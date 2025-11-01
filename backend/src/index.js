import express, { response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/stockRoutes.js";
import { Server } from "socket.io";
import http from "http";
import axios from "axios";
import WebSocket from "ws"
import { getCache,setCache } from "./config/cache.js";
import authRouter from "./routes/authRoutes.js";
import stockAuth from "./middleware/socketAuth.js";
import { subscriptions } from "./priceStore.js";
import portfolioRouter from "./routes/portfolioRoutes.js";
import { json } from "stream/consumers";
import { type } from "os";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/auth",authRouter) 
app.use("/api/portfolio",portfolioRouter)


const server = http.createServer(app);

const io=new Server(server,{
    cors:{origin:"*"},
});

io.use(stockAuth);

const apikey=process.env.FINNHUB_KEY;

const ws=new WebSocket(`wss://ws.finnhub.io?token=${apikey}`);

ws.on("open",()=>{
  console.log("Websocket connection done");
});

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

app.get("/",(req,res)=>res.send("StockPulse Websocket Server Running"));

io.on("connection",(socket)=>{
    console.log("client connected:",socket.id);

    socket.subscribedSymbols=new Set();

socket.on("subscribeToStock",(symbol)=>{
  subscriptions[symbol]=(subscriptions[symbol]||0)+1;
  socket.subscribedSymbols.add(symbol);
  ws.send(JSON.stringify({type:"subscribe",symbol}))
   console.log("Subscribe to:",symbol);
});

socket.on("disconnect",()=>{
  for(const symbol of socket.subscribedSymbols){
    subscriptions[symbol]=subscriptions[symbol]-1;
    if(subscriptions[symbol]<=0){
      delete subscriptions[symbol];
      ws.send(JSON.stringify({type:"unsubscribe",symbol}));
      console.log(`unsubscribed from ${symbol}`)
    }
  }
  console.log("client disconnected:-",socket.id);
})
});

ws.on("message", data => console.log("Raw message from Finnhub:", data))
ws.on("message",(data)=>{
  const stockData=JSON.parse(data)
  io.emit("stockUpdate",stockData)
})



app.use("/api/stocks", router); 


server.listen(5000,'0.0.0.0',()=>console.log("server running on port 5000"));


