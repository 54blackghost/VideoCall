import {StreamChat} from "stream-chat";
import "dotenv/config.js"



const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
     throw new Error("Stream API key or secret is missing");
    
}
 

const streamClient = StreamChat.getInstance(apiKey, apiSecret);


export const upsertStreamUser = async (userData) => {
    try {
       await streamClient.upsertUsers([userData]);
        return true;
    } catch (error) {
        console.log("Error upserting stream user:", error);
        return false;
    }
};

export const generateStreamToken = (userId) => {
    try {
        //ensure userId is a string
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error generating Stream token:", error);
        return null;
    }
};