import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";


// =====================================================
// GET RECOMMENDED USERS
// =====================================================
export async function getRecommendedUser(req, res) {
  try {
    // Récupérer l'utilisateur MongoDB à partir du Clerk ID
    const currentUser = await User.findOne({
      clerkId: req.clerkUserId,
    });

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const friendsList = currentUser.friends || [];

    const recommendedUsers = await User.find({
      _id: {
        $ne: currentUser._id,
        $nin: friendsList,
      },
      isOnboarded: true,
    })
      .select(
        "fullName profilePic nativeLanguage learningLanguage bio"
      )
      .limit(20);

    res.status(200).json(recommendedUsers);

  } catch (error) {
    console.error(
      "Error in getRecommendedUser controller:",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


// =====================================================
// GET MY FRIENDS
// =====================================================
export async function getMyFriends(req, res) {
  try {
    const currentUser = await User.findOne({
      clerkId: req.clerkUserId,
    })
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(currentUser.friends || []);

  } catch (error) {
    console.error(
      "Error in getMyFriends controller:",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


// =====================================================
// SEND FRIEND REQUEST
// =====================================================
export async function sendFriendRequest(req, res) {
  try {
    const currentUser = await User.findOne({
      clerkId: req.clerkUserId,
    });

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const myId = currentUser._id;
    const { id: recipientId } = req.params;

    // Empêcher de s'envoyer une demande à soi-même
    if (myId.toString() === recipientId) {
      return res.status(400).json({
        message: "You can't send friend request to yourself",
      });
    }

    // Vérifier que le destinataire existe
    const recipient = await User.findById(recipientId);

    if (!recipient) {
      return res.status(404).json({
        message: "Recipient not found",
      });
    }

    // Vérifier si déjà amis
    const alreadyFriends = recipient.friends.some(
      (friendId) => friendId.toString() === myId.toString()
    );

    if (alreadyFriends) {
      return res.status(400).json({
        message: "You are already friends with this user",
      });
    }

    // Vérifier si une demande existe déjà
    const existingRequest = await FriendRequest.findOne({
      $or: [
        {
          sender: myId,
          recipient: recipientId,
        },
        {
          sender: recipientId,
          recipient: myId,
        },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message:
          "A friend request already exists between you and this user",
      });
    }

    // Créer la demande
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);

  } catch (error) {
    console.error(
      "Error in sendFriendRequest controller:",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


// =====================================================
// ACCEPT FRIEND REQUEST
// =====================================================
export async function acceptFriendRequest(req, res) {
  try {
    const currentUser = await User.findOne({
      clerkId: req.clerkUserId,
    });

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const requestId = req.params.id;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        message: "Friend request not found",
      });
    }

    // Vérifier que l'utilisateur connecté est bien le destinataire
    if (
      friendRequest.recipient.toString() !==
      currentUser._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to accept this request",
      });
    }

    friendRequest.status = "accepted";

    await friendRequest.save();

    // Ajouter le sender dans les amis du recipient
    await User.findByIdAndUpdate(
      friendRequest.sender,
      {
        $addToSet: {
          friends: friendRequest.recipient,
        },
      }
    );

    // Ajouter le recipient dans les amis du sender
    await User.findByIdAndUpdate(
      friendRequest.recipient,
      {
        $addToSet: {
          friends: friendRequest.sender,
        },
      }
    );

    res.status(200).json({
      message: "Friend request accepted",
    });

  } catch (error) {
    console.error(
      "Error in acceptFriendRequest controller:",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


// =====================================================
// GET FRIEND REQUESTS
// =====================================================
export async function getFriendRequests(req, res) {
  try {
    const currentUser = await User.findOne({
      clerkId: req.clerkUserId,
    });

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const incomingReqs = await FriendRequest.find({
      recipient: currentUser._id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    const acceptedReqs = await FriendRequest.find({
      recipient: currentUser._id,
      status: "accepted",
    }).populate(
      "sender",
      "fullName profilePic"
    );

    res.status(200).json({
      incomingReqs,
      acceptReqs: acceptedReqs,
    });

  } catch (error) {
    console.error(
      "Error in getFriendRequests controller:",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


// =====================================================
// GET OUTGOING FRIEND REQUESTS
// =====================================================
export async function getOutgoingFriendReqs(req, res) {
  try {
    const currentUser = await User.findOne({
    clerkId: req.clerkUserId,
    });

    FriendRequest.find({
    sender: currentUser._id,
    });
    const outgoingRequests = await FriendRequest.find({
      sender: currentUser._id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    res.status(200).json({
      outgoingRequests,
    });

  } catch (error) {
    console.error(
      "Error in getOutgoingFriendReqs controller:",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}