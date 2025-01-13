import mongoose from "mongoose";
import config from "./config.js";

const dbConnect = async ()=>{
    try {
        const mongoURI =config.MONGODB_URI
        await mongoose.connect(mongoURI)
        console.log('DB connected');
    } catch (error) {
        console.error('connection error',error)
 
    }
}
export default dbConnect
