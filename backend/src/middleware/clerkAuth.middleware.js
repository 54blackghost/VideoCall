import { getAuth } from "@clerk/express";

export const protectClerkRoute = (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No Clerk session",
      });
    }

    req.clerkUserId = userId;

    next();
  } catch (error) {
    console.error("Clerk authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};