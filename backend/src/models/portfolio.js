import mongoose from "mongoose";

const PortfolioSchema=new mongoose.Schema({
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
});

const Portfolio=mongoose.model("Portfolio",PortfolioSchema);
export default Portfolio;