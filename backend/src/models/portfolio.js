import mongoose from "mongoose";

const PortfolioSchema=new mongoose.Schema({
    stock:{
        type:string,
        required:true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    BuyPrice: {
        type: Number,
        required: true,
    },
    totalCost:{
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