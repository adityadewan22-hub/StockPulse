import { connect } from "http2";
import {createClient} from "redis";

const client =createClient({
    url:"redis://localhost:6379",
});

client.on("error",(err)=>console.error("Redis Client error",err));

async function connectRedis() {
    try{
        await client.connect();
        console.log("connected to redis");
    }
    catch(err){
        console.log("redis not available",err.message);
    }
}

connectRedis();

export default client;
