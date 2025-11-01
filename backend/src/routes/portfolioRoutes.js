import verifyToken from "../middleware/authMiddleware.js";
import express from "express";
import { buyStock, getPortfolio, sellStock } from "../controllers/portfolioController.js";

const portfolioRouter=express.Router();

portfolioRouter.post("/buy",verifyToken,buyStock);

portfolioRouter.post("/sell",verifyToken,sellStock);
portfolioRouter.get("/port",verifyToken,getPortfolio);

export default portfolioRouter;