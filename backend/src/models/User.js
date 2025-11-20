import mongoose from "mongoose";
import bcrypt from "bcryptjs";

//creation de la table user
const userSchema = new mongoose.Schema({
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



//perder hasher le password avant de le save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))return next();

    try {
        //focntion qui perment de hasher les password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next();
    } catch (error) {
        next(error)
    }
})



//teste si le password est le meme
userSchema.methods.matchPassword = async function (enteredPassword) {
    const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordCorrect;
}

const User = mongoose.model("User", userSchema);


export default User;