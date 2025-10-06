import User from "../models/User.js";
import jwt from "jsonwebtoken";


export async function signup(req, res){
    const { email, password,fullName} = req.body

    try {
        
        //all fiels are required
        if (!email || !password || !fullName) {
            return res.status(400).json({message: "All fiels are required"});
        }
   
        
        //minimun 6 characters on the password
        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }



        //email format "ulrich@gmail.com" required
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }


        //test if an user already exisr 
        const existingUser = await User.findOne({ email});
        if (existingUser) {
            return res.status(400).json({message: "Email already exists, please use a diffrent one"});
        }


        const idx = Math.floor(Math.random() * 100) + 1; //generate a num between 1-100
        const randomAvatar = `https://avatar.iram.liara.run/public/${idx}.png`


        //create a new user
        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        })


        //secure authentification with jwt
        const token  = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:  "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //revent XSS attacks
            saneSite: "strict", //prevent CSRF attacks
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({success:true, user:newUser})
    } catch (error) {
        console.log("Error  in signup controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
     
}

export async function login(req, res){
    res.send(" Login Route");
}

export function logout(req, res){
    res.send(" Logout Route");
}