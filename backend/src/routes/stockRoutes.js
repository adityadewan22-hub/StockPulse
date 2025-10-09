import { stockData } from "../controllers/stockController.js";
import express from "express";

const router= express.Router();
router.get("/:symbol",stockData);

export default router;