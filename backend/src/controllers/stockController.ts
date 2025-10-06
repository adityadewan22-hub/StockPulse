import axios from "axios";
import { Request,Response } from "express";

export const stockData= async(req:Request,res:Response)=>{
    const symbol=req.params.symbol;
    try{
        const response=await axios.get(`https://www.alphavantage.co/query`,{
            params:{
                function:"TIME_SERIES_INTRADAY",
                symbol,
                interval:"5min",
                apikey:process.env.ALPHA_VANTAGE_KEY,
            }
        })
        res.json(response.data);
    }
    catch(error){
        res.status(500).json({message:"error fetching stock data"});
    }
}