import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email: {
        type: String,
        unique: true, 
        required: true 
    },
    password:{
        type:String
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
  
},{timestamps:true});


const adminModel = mongoose.model("admin",adminSchema)
export {adminModel}
