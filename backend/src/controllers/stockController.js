import axios from "axios";
import { getCache,setCache } from "../config/cache.js";

export const stockData= async(req,res)=>{
    const symbol=req.params.symbol;
    try{
        const cacheAvailable=await getCache(symbol);
        if(cacheAvailable){
            return res.json(cacheAvailable)
        }
        else{
            try{
        const response=await axios.get(`https://finnhub.io/api/v1/quote`,{
            params:{
                symbol,
                token:process.env.FINNHUB_KEY,
            }
        })
        res.json(response.data);
        await setCache(symbol,response.data,15)
    }
    catch(error){
        res.status(500).json({message:"error fetching stock data"});
    }
        }
    }catch(err){
        console.log(err.message)
    }
}