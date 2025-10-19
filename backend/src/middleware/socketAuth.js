import { error } from "console";
import jwt from "jsonwebtoken";

const stockAuth=async(socket,next)=>{
    const token=socket.handshake.auth.token;
    if (!token){
        return next(new Error("No token provided"));
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_KEY);
        next();
    }catch(err){
        next(new Error("token invalid"));
    }
}

export default stockAuth;