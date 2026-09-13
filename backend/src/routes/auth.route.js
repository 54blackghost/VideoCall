import express from "express";
import { login, logout, signup, onboard } from "../controllers/auth.controller.js";

import { protectClerkRoute } from "../middleware/clerkAuth.middleware.js";
import { syncClerkUser } from "../controllers/auth.controller.js";


const router = express.Router();


//router.post("/signup", signup);
//router.post("/login", login);
//router.post("/logout", logout);


//router.post("/onboarding", protectRoute, onboard);
router.post( "/onboarding",protectClerkRoute,onboard);

//check if user is logged in
//router.get("/me", protectRoute, (req, res) =>{
//    res.status(200).json({success: true, user: req.user});
//});



router.get( "/clerk/sync", protectClerkRoute, syncClerkUser);


router.get("/clerk/me", protectClerkRoute, async (req, res) => {
  try {
    const user = await User.findOne({
      clerkId: req.clerkUserId,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in MongoDB",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Clerk user error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});


export default router;