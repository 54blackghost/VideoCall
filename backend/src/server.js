import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";


const app = express();
const PORT = process.env.PORT;

 app.use("/api/auth", authRoutes)
//console.log(signup);


//ecouteur de port par defaut 5001
app.listen(PORT, ()=>{
    console.log(`server is listening on this port ${PORT}`);
    connectDB();
});

