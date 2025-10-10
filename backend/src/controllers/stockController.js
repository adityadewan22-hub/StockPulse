import axios from "axios";

export const stockData= async(req,res)=>{
    const symbol=req.params.symbol;
    try{
        const response=await axios.get(`https://finnhub.io/api/v1/quote`,{
            params:{
                symbol,
                token:process.env.FINNHUB_KEY,
            }
        })
        res.json(response.data);
    }
    catch(error){
        res.status(500).json({message:"error fetching stock data"});
    }
}