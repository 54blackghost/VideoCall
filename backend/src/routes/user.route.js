import express from  "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendReqs, getRecommendedUser, sendFriendRequest } from "../controllers/user.controller.js";



const  router = express.Router();

//apply auth middleware to all routes
router.use(protectRoute);


router.get("/", getRecommendedUser);
router.get("/friends",  getMyFriends);


router.post("/friend-request/:id",protectRoute, sendFriendRequest);
router.post("/friend-request/:id/accept", protectRoute, acceptFriendRequest);

router.get("/friend-requests", protectRoute, getFriendRequests );
router.get("/outgoing-friend-requests", protectRoute, getOutgoingFriendReqs);


export default router;