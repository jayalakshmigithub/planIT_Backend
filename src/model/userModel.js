import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email: {
        type: String,
        required: true 
    },
    password:{
        type:String
    },
    isGoogle:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isInvited: { 
        type: Array, 
        default: [] 
    },
        
    otp:{
        type:String
    },
    image:{
        type:String
    },

    workspace:{
        type:Array,
        default:[]
    },
    sharedWorkspaces: { 
        type: Array, 
        default: [] 
    },

      workspaceId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace', 
    },
    otp:{
        type: Number
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
  
},{timestamps:true});

userSchema.index({email:1} ,{unique:true})
const userModel = mongoose.model("user",userSchema)
export {userModel}
