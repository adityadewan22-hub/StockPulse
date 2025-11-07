import axios from "axios";
import dotenv from "dotenv"

dotenv.config();

const apikey=process.env.FINNHUB_KEY

const isOpen=async()=>{
    try{
        const market=await axios.get(`https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${apikey}`)
        return market.data.isOpen
    }catch(err){
        console.log("market access error", err.response.status, err.response.data)
    }
}

export default isOpen;