import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";


const app = express();
const PORT = process.env.PORT;



// 🔹 Middleware nécessaires
app.use(cors({
     origin: process.env.CLIENT_URL, // allow frontend to access backend
    credentials: true // allow frontend to send cookies
}));

app.use(express.json()); // <---- Obligatoire pour lire req.body JSON
app.use(express.urlencoded({ extended: true })); // <---- Pour lire les formulaires HTML
app.use(cookieParser());




app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);


//ecouteur de port par defaut 5001
app.listen(PORT, ()=>{
    console.log(`server is listening on this port ${PORT}`);
    connectDB();
});

