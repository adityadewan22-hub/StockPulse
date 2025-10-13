import client from "./redisClient";

export const getCache= async(key)=>{
    const cached=await client.get(key);
    return cached?JSON.parse(cached):null;
}

export const setCache=async(key,data,ttl=10)=>{
    await client.set(key,JSON.stringify(data),{EX:ttl});
}