
import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import { clerkClient } from "@clerk/express";


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
        const user = await User.findOne({ clerkId: req.clerkUserId,});

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
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.status(200).json({success: true, message: "Logout successful"});
}

export const onboard = async (req, res) => {
  try {
    const {
      fullName,
      bio,
      nativeLanguage,
      learningLanguage,
      location,
    } = req.body;

    const user = await User.findOne({
      clerkId: req.clerkUserId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.fullName = fullName;
    user.bio = bio;
    user.nativeLanguage = nativeLanguage;
    user.learningLanguage = learningLanguage;
    user.location = location;
    user.isOnboarded = true;

    await user.save();

    await upsertStreamUser({
      id: req.clerkUserId,
      name: user.fullName,
      image: user.profilePic,
    });

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Onboarding error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const syncClerkUser = async (req, res) => {
  try {
    const clerkUserId = req.clerkUserId;

    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    if (!clerkUser) {
      return res.status(404).json({
        success: false,
        message: "Clerk user not found",
      });
    }

    const email = clerkUser.emailAddresses?.[0]?.emailAddress;

    const fullName =
      [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(" ") ||
      clerkUser.username ||
      "User";

    const profilePic = clerkUser.imageUrl || "";

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "No email associated with Clerk account",
      });
    }

    let user = await User.findOne({
      clerkId: clerkUserId,
    });

    if (!user) {
      user = await User.findOne({
        email: email.toLowerCase(),
      });
    }

    if (!user) {
      user = await User.create({
        clerkId: clerkUserId,
        fullName,
        email: email.toLowerCase(),
        profilePic,
        isOnboarded: false,
      });

      console.log("MongoDB user created:", user._id);
    } else {
      user.clerkId = clerkUserId;
      user.fullName = fullName;
      user.email = email.toLowerCase();
      user.profilePic = profilePic;

      await user.save();

      console.log("MongoDB user synchronized:", user._id);
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("syncClerkUser error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to synchronize Clerk user",
    });
  }
};