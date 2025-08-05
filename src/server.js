import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js"
dotenv.config();

const app=express()

//middleware
app.use(rateLimiter);
app.use(express.json());
app.use("/api/transactions",transactionRoute)

const PORT=process.env.PORT|| 5001;

app.get("/health",(req,res)=>{
    res.send("It's working!");
})
app.get("/api/health",(req,res)=>{
    res.status(200).json({status: "ok"})
})

if(process.env.NODE_ENV==="production")job.start();


initDB().then(()=>{
    app.listen(PORT,()=>{
    console.log("Server is running at port:",PORT);
})
})



