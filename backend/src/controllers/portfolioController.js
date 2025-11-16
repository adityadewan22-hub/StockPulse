import Portfolio from "../models/portfolio.js";
import { prices,subscriptions } from "../priceStore.js";

export const buyStock=async(req,res)=>{
    try{
        const {symbol,quantity,buyPrice}=req.body;
        const userId=req.user._id;

        let existingStock= await Portfolio.findOne({userId,symbol})
        if(existingStock){
            let totalQuantity=existingStock.quantity+quantity;
            let totalCost=existingStock.totalInvested+quantity*buyPrice;

            existingStock.buyPrice=totalCost/totalQuantity;
            existingStock.quantity=totalQuantity;
            existingStock.totalInvested=totalCost;
            await existingStock.save();

            return res.status(200).json({
                message:"Stock updated sucessfully",
                stock:existingStock,
            })
        }
        else{
            const newStock=new Portfolio({
                userId,
                symbol,
                quantity,
                buyPrice,
                totalInvested:quantity*buyPrice,
            })
            await newStock.save();
            res.status(200).json({
                message:"stock added",
                stock:newStock
            })
        }
    }catch(err){
        console.log(err.message);
    }
}

export const sellStock=async(req,res)=>{
    try{
        const {symbol,quantity,sellPrice}=req.body;
        const userId=req.user._id;
        const stock=await Portfolio.findOne({userId,symbol});
        if(!stock){
            return res.status(404).json({message:"stock not found in portfolio"})
        }
        if(quantity>stock.quantity){
            return res.status(404).json({message:"not enough shares to sell"})
        }
        const profit=(sellPrice-stock.buyPrice)*quantity;
        stock.quantity=stock.quantity-quantity;
        stock.totalInvested=stock.buyPrice*quantity;
        stock.profit = (stock.profit || 0) + profit;
        if(stock.quantity===0){
            await stock.deleteOne();
        }
        else{
            await stock.save();
        }
        return res.status(200).json({
            message:"stock sold successfully",
            profit,
        })

    }catch(err){
        console.log(err.message);
    }
}

export const getPortfolio=async(req,res)=>{
    try{
        const userId=req.user._id;
        const portfolio=await Portfolio.find({userId});
        res.status(200).json(portfolio);
        console.log("Authenticated user:", req.user._id);
    }catch(err){
        console.log(err.message);
    }
}