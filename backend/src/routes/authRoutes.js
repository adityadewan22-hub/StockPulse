import express from "express"
import { loginUser,registerUser } from "../controllers/authController";

const authRouter=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);

export default authRouterouter;

