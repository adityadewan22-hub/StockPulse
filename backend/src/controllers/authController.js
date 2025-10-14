import User from "../models/user"
import bcrypt from "bcrypt";

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
    }catch(err){
        console.log("couldn't register",err.message);
    }
}