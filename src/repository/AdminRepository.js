import { adminModel } from "../model/adminModel.js";
import { projectModel } from "../model/projectModel.js";
import { userModel } from "../model/userModel.js";
import { workspaceModel } from "../model/workspaceModel.js";



       
const findAdminByEmail = async(email)=>{
    try {
        const adminEmail = await adminModel.findOne({email})
        return adminEmail
        
    } catch (error) {
        console.log('error in findAdminByemail',error)
        throw error
        
    }
}

const findAdminById = async(_id)=>{
    try {
        const admin = await adminModel.findById(_id)
        return admin
    } catch (error) {
        console.log("Error findAdminById:", error);
        throw error;
        
    }
}

const findAllUsers = async()=>{
    try {
        const userslist = await userModel.find()
        return userslist
    } catch (error) {
        console.error('error happened in findallusers',error)
        throw error
        
    }
}




const blockUser = async(_id)=>{
    try {
        const blockedUser = await userModel.findByIdAndUpdate(
            _id,
            {isBlocked:true},
            {new:true}
        )
        if (!blockedUser) {
            throw new Error("User not found");
          }
          return blockedUser;
        
    } catch (error) {
        console.error("error occured in blockUsers ",error)
        throw error
        
    }

}

const unblockUser = async(_id)=>{
    try {
        const unblockedUser = await userModel.findByIdAndUpdate(
            _id,
            {isBlocked:false},
            {new:true}
        )
        if (!unblockedUser) {
            throw new Error("User not found");
          }
          return unblockedUser;
        
    } catch (error) {
        console.error("error occured in unblockUsers ",error)
        throw error
        
    }
}


const findAllWorkspacesAdmin = async()=>{
    try {
        const workspaceList =  workspaceModel.find().populate('OwnerId', 'name');
        return workspaceList
    } catch (error) {
        console.error('error in workspace lisitng repository',error);
        throw error
        
        
    }
}
const findWorkspaceById = async(workspaceId)=>{
    try {
        const workspaceById = await workspaceModel.findById(workspaceId)
        return workspaceById
    } catch (error) {
        console.error('error in workspace lisitng repository',error);
        throw error
        
    }
}

const findAllProjects = async () => {
    try {
        const projects = await projectModel
            .find()
            .select('projectName workspaceName members.email fromDate');

        
        const workspaceIds = [...new Set(projects.map((project) => project.workspaceName))];

        const workspaces = await workspaceModel.find({ _id: { $in: workspaceIds } }).select('name');

     
        const workspaceMap = {};
        workspaces.forEach((workspace) => {
            workspaceMap[workspace._id.toString()] = workspace.name; 
        });


        const populatedProjects = projects.map((project) => ({
            ...project._doc,
            workspaceName: workspaceMap[project.workspaceName] || 'Unknown Workspace',
        }));

        return populatedProjects;
    } catch (error) {
        console.error('Error in fetching project list with workspace names and members:', error);
        throw error;
    }
};

const listedWorkspace = async(workspaceId)=>{
    try {
        const activeWorkspaces = await workspaceModel.findById(workspaceId)
        return activeWorkspaces
    } catch (error) {
        console.error('error in workspace lisitng repository',error);
        throw error
        
    }
}

const delistedWorkspace = async(workspaceId)=>{
    try {
        const delistWorkspace = await workspaceModel.findById(workspaceId)
        return delistWorkspace
    } catch (error) {
        console.error('error in workspace delisting repository',error);
        throw error
           
    }
}






export {
    findAdminByEmail,
    findAdminById,
    findAllUsers,
    blockUser,
    unblockUser,
    findAllWorkspacesAdmin,
    findAllProjects,
    findWorkspaceById,
    listedWorkspace,
    delistedWorkspace
    


}