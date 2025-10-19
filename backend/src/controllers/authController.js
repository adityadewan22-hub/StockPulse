import User from "../models/user.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser=async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);
        const newUser=new User({username,email,password:hashedPassword});
        await newUser.save();
        const token=jwt.sign({_id:newUser._id,email:newUser.email},process.env.JWT_KEY,{expiresIn:"7d"});
        res.status(200).json({ token, user: { username: newUser.username, email: newUser.email } });
    }catch(err){
        console.log("couldn't register",err.message);
    }
}

export const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const existingUser=await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const match=await bcrypt.compare(password,existingUser.password);
        if(!match){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const token=jwt.sign({_id:existingUser._id,email:existingUser.email},process.env.JWT_KEY,{expiresIn:"7d"});
        res.status(200).json({ token, user: { username: existingUser.username, email: existingUser.email } });

    }catch(err){
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
}