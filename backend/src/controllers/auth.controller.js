import { json } from "express";
import { upsertStreamUser } from "../lib/stream.js";
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
        

        //insérer un utilisateur pour diffuser le service
       try {
         await upsertStreamUser({
            id:newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic || "",
        });
          console.log(`Stream user created for ${newUser.fullName}`);
       } catch (error) {
        console.log("Error creating stream user:", error);
       }

        //secure authentification with jwt
        const token  = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:  "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //revent XSS attacks
            saneSite: "strict", //prevent CSRF attacks
            secure: process.env.NODE_ENV === "production"
        });

        res.status(201).json({success:true, user:newUser})
    } catch (error) {
        console.log("Error  in signup controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
     
}

export async function login(req, res){
    try {
        const {email, password} = req.body;


        //teste si tous les champs ont ete remplir
        if (!email || !password) {
            return res.status(400).json({message: "All fiels are required"});
        }


        //teste si un user existe
        const user = await User.findOne({email});

        if (!user) return res.status(401).json({message: "Invalid email or password"}); 


        //teste si le password de l'user est correct
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) return res.status(401).json({message: "Invalid email or password"});


        const token  = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
            expiresIn:  "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //revent XSS attacks
            //sameSite: "strict", //prevent CSRF attacks in production
            //secure: process.env.NODE_ENV === "production"  // in production 
            sameSite: "lax",
            path: "/", 
            secure: false,

        });



        res.status(200).json({success: true, user});
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    } 
}

export function logout(req, res){
    res.clearCookie("jwt");
    res.status(200).json({success: true, message: "Logout successful"});
}

export async function onboard(req, res) {
    try {
        const userId = req.user._id;
        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

        if (!fullName || !bio || !nativeLanguage  || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: {
                    fullName: !fullName,
                    bio: !bio,
                    nativeLanguage: !nativeLanguage,
                    learningLanguage: !learningLanguage,
                    location: !location
                }.filter(Boolean),
        });
        }


        //permet de modifier un user profile
        const updatedUser =  await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, {new:true})


        if (!updatedUser) return res.status(404).json({message: "User nnot found"});
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || " ",
            });
            console.log(`Stream user updated for ${updatedUser.fullName}`); 
        } catch (streamError) {
            console.log("Error updaring Stream user during onboarding", streamError.message);
        }


         res.status(200).json({success: true, user: updatedUser});
    } catch (error) {
        console.error("Onboarding erroor:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}