import client from "./redisClient.js";

export const getCache= async(key)=>{
    const cached=await client.get(key);
    return cached?JSON.parse(cached):null;
}

export const setCache=async(key,data,ttl=15)=>{
    await client.set(key,JSON.stringify(data),{EX:ttl});
}