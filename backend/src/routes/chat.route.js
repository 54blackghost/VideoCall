import express from  "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";


const  router = express.Router();
 

router.get("/token", protectRoute, getStreamToken);


//router.get("/",getRecommendedUser);
//router.get("/", getMyFriends);


//router.post("/friend-request/:id", sendFriendRequest);
//router.put("/friend-request/:id/accept", acceptFriendRequest);

//router.get("/friend-requests", getFriendRequests );
//router.get("/outgoing-friend-requests", getOutgoingFriendReqs);
export default router;