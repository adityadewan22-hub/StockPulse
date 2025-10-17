import { stockData } from "../controllers/stockController.js";
import express from "express";
import verifyToken from "../middleware/authMiddleware.js";

const router= express.Router();
router.use(verifyToken);
router.get("/:symbol",stockData);

export default router;