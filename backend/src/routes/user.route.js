import express from "express";

import { protectClerkRoute } from "../middleware/clerkAuth.middleware.js";

import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUser,
  sendFriendRequest,
} from "../controllers/user.controller.js";

const router = express.Router();

// Toutes les routes /users sont protégées par Clerk
router.use(protectClerkRoute);

router.get("/", getRecommendedUser);

router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);

router.post(
  "/friend-request/:id/accept",
  acceptFriendRequest
);

router.get("/friend-requests", getFriendRequests);

router.get(
  "/outgoing-friend-requests",
  getOutgoingFriendReqs
);

export default router;