import {client} from "./redisClient.js";
import { redisAvailable } from "./redisClient.js";

export const getCache= async(key)=>{
    if(!redisAvailable){
        return null;
    }
    try{
        const cached=await client.get(key);
    return cached?JSON.parse(cached):null;
    }catch(err){
        console.log("redis get failed");
        return null;
    }
    
}

export const setCache=async(key,data,ttl=15)=>{
    if(!redisAvailable){
        return null;
    }
    try{
        await client.set(key,JSON.stringify(data),{EX:ttl});
    }catch(err){
        console.log("redis set failed")
    }
}