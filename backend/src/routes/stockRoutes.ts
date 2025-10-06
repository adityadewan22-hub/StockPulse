import { stockData } from "../controllers/stockController";
import express from "express";

const router= express.Router();
router.get("/:symbol",stockData);

export default router;