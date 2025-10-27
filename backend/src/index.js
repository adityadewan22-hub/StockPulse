import express, { response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/stockRoutes.js";
import { Server } from "socket.io";
import http from "http";
import axios from "axios";
import { getCache,setCache } from "./config/cache.js";
import authRouter from "./routes/authRoutes.js";
import stockAuth from "./middleware/socketAuth.js";
import { subscriptions } from "./priceStore.js";
import portfolioRouter from "./routes/portfolioRoutes.js";

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
    console.log("Subscribe to:",symbol);

const interval =setInterval(async()=>{
    try{
      let data=null;
      try{
        const cache=await getCache(symbol);
      if(cache){
        data=cache;
        console.log(`cache hit for ${symbol}`);
        socket.emit("stockUpdate",{
          symbol,
          price:cache.c,
          change:cache.d,
          percentageChange:cache.dp,
        });
        return;
      }
    }
      catch(redisERR){
        console.log("redis get failed")
      }
      if(!data){
        const response= await axios.get(
            `https://finnhub.io/api/v1/quote`,{
                params:{symbol, token:apikey}
            }
        );
        data=response.data;
      }
      console.log("Fetched data:",data);

        
if (!data || Object.keys(data).length === 0) {
  console.log("No data received for", symbol);
  return;
}
try{
  await setCache(symbol,data,15);
}catch(redisERR){
  console.log("redis failed, skipping cache");
}


socket.emit("stockUpdate", {
  symbol,
  price:data.c,
  change:data.d,
  percentageChange:data.dp
});
    }
    catch(err){
        if (err.response) {
    console.log("Status:", err.response.status);
    console.log("Headers:", err.response.headers);
    console.log("Data:", err.response.data);
  } else {
    console.error("Error:", err.message);
  }
    }
},15000);
if(!socket.intervals){
  socket.intervals=[];
}
socket.intervals.push(interval);

});

socket.on("disconnect",()=>{
  if(socket.intervals){
    for(const i of socket.intervals){
      clearInterval(i);
    }
  }
  for(const symbol of socket.subscribedSymbols){
    subscriptions[symbol]=subscriptions[symbol]-1;
    if(subscriptions[symbol]<=0){
      delete subscriptions[symbol];
      console.log(`unsubscribed from ${symbol}`)
    }
  }
  console.log("client disconnected:-",socket.id);
})
});



app.use("/api/stocks", router); 


server.listen(5000,'0.0.0.0',()=>console.log("server running on port 5000"));


