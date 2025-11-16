import mongoose from "mongoose";
import { type } from "os";

const PortfolioSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    symbol:{
        type:String,
        required:true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    buyPrice: {
        type: Number,
        required: true,
    },
    totalInvested:{
        type:Number,
        default:0,
    },
    totalValue: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    profit:{
        type:Number,
        default:0
    }
});

const Portfolio=mongoose.model("Portfolio",PortfolioSchema);
export default Portfolio;