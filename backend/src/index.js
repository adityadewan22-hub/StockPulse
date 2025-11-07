import express, { response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
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
import isOpen from "../utils/checkMarket.js";

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

let ws=null;


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
  if(ws){
    ws.send(JSON.stringify({type:"subscribe",symbol}))
  }
   console.log("Subscribe to:",symbol);
});

socket.on("disconnect",()=>{
  for(const symbol of socket.subscribedSymbols){
    subscriptions[symbol]=subscriptions[symbol]-1;
    if(subscriptions[symbol]<=0){
      delete subscriptions[symbol];
      if(ws){
      ws.send(JSON.stringify({type:"unsubscribe",symbol}));
      }
      console.log(`unsubscribed from ${symbol}`)
    }
  }
  console.log("client disconnected:-",socket.id);
})
});

app.use("/api/stocks", router); 


server.listen(5000,'0.0.0.0',()=>{
  console.log("server running on port 5000");
  setupFinnhubConnection();
}
);

async function setupFinnhubConnection() {
  try {
    const open = await isOpen();
    if (open) {
      ws = new WebSocket(`wss://ws.finnhub.io?token=${apikey}`);

      ws.on("open", () => console.log("Finnhub WS connected"));
      io.emit("marketStatus",{isOpen:true});

     ws.on("message", (data) => {
  try {
    const parsed = JSON.parse(data.toString());
    if (parsed.type === "trade" && parsed.data?.length) {
      parsed.data.forEach((trade) => {
        io.emit("stockUpdate", {
          symbol: trade.s,
          price: trade.p,
          volume: trade.v,
          time: trade.t,
        });
      });
    }
  } catch (err) {
    console.error("Error parsing:", err);
  }
});
    } else {
      console.log("market closed")
      io.emit("marketStatus", { isOpen: false });
    }
  } catch (err) {
    console.error("Error setting up Finnhub WS:", err);
  }
}


