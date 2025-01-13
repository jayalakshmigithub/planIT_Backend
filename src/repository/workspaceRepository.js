



import { workspaceModel } from "../model/workspaceModel.js"
import { userModel } from "../model/userModel.js";



const findworkspaceById = async (workspaceId) => {
    try {
        const workspace = await workspaceModel.findById(workspaceId).populate('members.userId', 'email');
        return workspace;
    } catch (error) {
        console.error("Error at findworkspaceById:", error);
        throw error;
    }
}


const createWorkspace = async (workspaceData) => {
    try {
        const newWorkspace = new workspaceModel({
            name: workspaceData.name,
            description: workspaceData.description,
            OwnerId: workspaceData.OwnerId
        });

       
        await newWorkspace.save();
        const user = await userModel.findById(workspaceData.OwnerId);
        if (user) {
          
            if (!user.workspace) {
                user.workspace = [];
            }
            user.workspace.push(newWorkspace);
            await user.save();
        } else {
            throw new Error('User not found');
        }

        return newWorkspace;

    } catch (error) {
        console.error('Error in repository:', error);
        throw error;
    }
};




const findWorkspaceByOwner = async (ownerId) => {
    try {
        
        const works = await workspaceModel.find({ OwnerId: ownerId })
        .populate('OwnerId','name')
            .populate('members', 'email');
            
        return works;
    } catch (error) {
        console.log("Error in findWorkspaceByOwner:", error);
        throw error;
    }
};

// const findWorkspaceByOwner = async (ownerId) => {
//     try {
//         const works = await workspaceModel
//             .find({ OwnerId: ownerId })
//             .populate('members', 'email') 
//             .populate('OwnerId', 'name') 
             

//         const formattedWorks = works.map(workspace => ({
//             id: workspace._id,
//             name: workspace.name,
//             ownerName: workspace.OwnerId?.name || 'Unknown',
//             memberCount: workspace.members.length,
//             projects: workspace.projects.length, 
//             description: workspace.description,
//             // createdAt: workspace.createdAt,
            
//         }));

//         return formattedWorks;
//     } catch (error) {
//         console.log("Error in findWorkspaceByOwner:", error);
//         throw error;
//     }
// };






const findSharedWorkspace = async (userId) => {
    try {
       
        const user = await userModel.findById(userId);

       
        if (!user || !user.sharedWorkspaces || user.sharedWorkspaces.length === 0) {
            return [];
        }

     
        const sharedWorkspaceIds = user.sharedWorkspaces; 
        const sharedWorkspaces = await workspaceModel.find({ _id: { $in: sharedWorkspaceIds } })
        .populate('OwnerId', 'name');

        return sharedWorkspaces; 
    } catch (error) {
        console.error('Error occurred in findSharedWorkspace:', error);
        throw error;
    }
};


const findAllWorkspaces = async(userId)=>{
    try {
        const allWorkspaces = await workspaceModel.find({OwnerId:userId})
        return allWorkspaces
    } catch (error) {
        console.error(error)
        
    }
}

const insertToWorkspace = async(info)=>{
try {
    
        const workspace = await workspaceModel.findById(info.workspaceId)
        
        const membersEmail = workspace?.members.map(member=>member.email)
    
        const updatedInfo = info.updateMembers.filter(members=>{
            return !membersEmail?.includes(members.email)
        })
        updatedInfo.forEach(member => member.workspaceId = workspace?._id.toString());
    
         await workspaceModel.updateOne(
            {_id:info.workspace},
            {$push:{members:{$each:updatedInfo}}}
         )
         return updatedInfo
} catch (error) {
    console.error(error);
    throw new Error("Failed to update workspace members.");
    
}
}



const FetchWorkspace = async(workspaceId)=>{
    try {
        const EachWorkspace = await workspaceModel.findById(workspaceId).populate({
            path:'members',
            select:'email'
        })
        return EachWorkspace
    } catch (error) {
        console.log('error',error)
        throw error 
        
    }
}

const deleteWorkspaceById = async (workspaceId) => {
    try {
      const deletedWorkspace = await workspaceModel.findByIdAndDelete(workspaceId);
      return deletedWorkspace;
    } catch (error) {
      throw new Error('Error deleting workspace');
    }
  };

export {
    createWorkspace,
    findWorkspaceByOwner,
    FetchWorkspace,
    findAllWorkspaces,
    findworkspaceById,
    insertToWorkspace,
    // workspaceById,
    findSharedWorkspace,
    deleteWorkspaceById
}







