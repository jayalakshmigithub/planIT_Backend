import mongoose from "mongoose";


const invitationSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    token:{
        type:String,
        required:true,

    }
    
},{timestamps:true})

invitationSchema.index({createdAt:1},{expireAfterSeconds:30*24*60*60})

const invitationModel = mongoose.model('invitationSchema',invitationSchema)
export {invitationModel}