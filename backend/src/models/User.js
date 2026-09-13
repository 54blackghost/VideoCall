import mongoose from "mongoose";


//creation de la table user
const userSchema = new mongoose.Schema({
    clerkId: {
    type: String,
    unique: true,
    sparse: true,
    },
   fullName:{
    type:String,
    require: true,
   },
    email:{
    type:String,
    require: true,
    unique: true,
   },
    password:{
    type:String,
    require: true,
    minlength: 6
   },
    bio:{
    type:String,
    default: " ",
   },
    profilePic:{
    type:String,
    default: " ",
   },
    nativeLanguage:{
    type:String,
    default: " ",
   },
    learningLanguage:{
    type:String,
    default: " ",
   },
    location:{
    type:String,
    default: " ",
   },
    isOnboarded:{
    type:Boolean,
    default: false,
   },

   // ici cest une liste parce que on aura plusieurs amitier a demander.
   friends:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
   ]
},{timestamps:true});




const User = mongoose.model("User", userSchema);


export default User;