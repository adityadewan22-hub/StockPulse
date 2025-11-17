import { error } from "console";
import jwt from "jsonwebtoken";

const stockAuth=async(socket,next)=>{
    next();
}

export default stockAuth;