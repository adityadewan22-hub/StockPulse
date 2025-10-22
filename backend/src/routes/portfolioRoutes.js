import verifyToken from "../middleware/authMiddleware";
import express from "express";
import { buyStock, getPortfolio, sellStock } from "../controllers/portfolioController";

const portfolioRouter=express.router();

portfolioRouter.post("/buy",verifyToken,buyStock);
portfolioRouter.post("/sell",verifyToken,sellStock);
portfolioRouter.get("/",verifyToken,getPortfolio);

export default portfolioRouter;