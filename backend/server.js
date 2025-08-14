import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import {sql} from './config/db.js';
import {aj} from './lib/arcjet.js';
import userRoutes from './routes/userRoutes.js';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

console.log(PORT) ;
app.use(express.json());
// cors is a small code you add to your backend to say:
// “Hey browser, it's okay! I allow this request.”   
app.use(cors());
app.use(helmet());
app.use(morgan("dev")); //"dev" is a format string that tells Morgan how to log requests in the console. "common"

//apply arcjet 
app.use(async (req,res,next) =>{
   try {
    const decision = await aj.protect(req,{
        requested:1
    })
            
    if(decision.isDenied()){
        if(decision.reason.isRateLimit()){
            res.status(429).json({message:"Rate limit exceeded"});   //429 = rate limiting
        } 
        else if(decision.reason.isBot()){
            res.status(403).json({message:"You are a bot"});  //403 = bot
        }
        else{
            res.status(401).json({message:"Forbidden"});  //401 = unauthorized
        }
        return;
    }
    // CHECK FOR SPOOFED BOTS(WHEN A BOTS TRIES TO ACT LIKE IT IS NOT A BOT) 
    if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())){
        res.status(403).json({message:"You are a spoofed bot"});  
        return;
    }
    next();
   } catch (error) {
       console.error("arcjet error",error);
   }
});


app.use("/api/products",productRoutes);
app.use("/api/users",userRoutes);

async function initDb(params) {
    try{
      await sql`
      CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

    await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
    console.log("DATABASE INITIALIZED SUCCESSfullly")
    }catch(error){
        console.log("error",error);
    }
}




initDb().then(()=>{
app.listen(PORT,()=>{
    console.log("Server is running on port"+PORT);
});
});
