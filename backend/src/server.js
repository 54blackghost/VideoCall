import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { clerkMiddleware } from "@clerk/express";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";


import { connectDB } from "./lib/db.js";


const app = express();

app.use(clerkMiddleware());

const PORT = process.env.PORT;


const __dirname = path.resolve(); // <---- Pour obtenir le chemin absolu du répertoire courant



// 🔹 Middleware nécessaires
app.use(cors({
     origin: "http://localhost:5173", // allow frontend to access backend
    credentials: true // allow frontend to send cookies
}));

app.use(express.json()); // <---- Obligatoire pour lire req.body JSON
app.use(express.urlencoded({ extended: true })); // <---- Pour lire les formulaires HTML



// Clerk
app.use(clerkMiddleware());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);




if (process.env.NODE_ENV === "production") {
     const frontendPath = path.join(
        __dirname,
        "../frontend/dist"
    );

    app.use(express.static(frontendPath)); // <---- Pour servir les fichiers statiques du frontend
    
    app.get("/*splat", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    }); 
}


//ecouteur de port par defaut 5001
app.listen(PORT, ()=>{
    console.log(`server is listening on this port ${PORT}`);
    connectDB();
});

