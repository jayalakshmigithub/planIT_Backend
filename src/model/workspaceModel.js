    // workspace : name,project id array of projects,usersid,description,disable and enable workspace,created at,updated Time,created by ,owner name

    import mongoose from "mongoose";

    const workspaceSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        description:{
            type:String
        },
        

        members: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'user'
            }
        ],
        
        projects:{
            type:Array,
            default:[]

        },
        tasks:{
            type:Array,
            default:[]

        },
        OwnerId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required :true
        }

    },{timestamps:true})
    const workspaceModel = mongoose.model('workspace',workspaceSchema)
    export {workspaceModel}