





import * as workspaceServices from '../services/workspaceServices.js'
import { workspaceModel } from "../model/workspaceModel.js"
import { userModel } from "../model/userModel.js";
import { findworkspaceById } from '../repository/workspaceRepository.js';



const createWorkspace = async(req,res)=>{
    try {
        const {name ,description} = req.body
        const OwnerId = req.userId

    const workspaceData = {name,description,OwnerId}
    console.log('hiii creating workspace',workspaceData)
    const workspace = await workspaceServices.getWorkspace(workspaceData)
    return res.status(200).json({workspace})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:'internal server error'})
        
    }

}



const getWorkspaces = async (req, res) => {
    try {
        const ownerId = req.userId;
        const userId = req.userId;

        if (!ownerId) {
            return res.status(500).json({ message: 'No user ID error' });
        }

        const workspace = await workspaceServices.listWorkspaceByOwner(ownerId);
        console.log('workspacess',workspace)
        const sharedWorkspace = await workspaceServices.getSharedWorkspaces(userId);
        // console.log('Owned Workspaces:', workspace);
        // console.log('Shared Workspaces:', sharedWorkspace);
        return res.status(200).json({ workspace, sharedWorkspace });
    } catch (error) {
        console.error('Error fetching workspaces:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};





















const sharedWorkspace = async(req,res)=>{
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(400).json({ message: 'No user ID found' });
        }
        const sharedWorkspace = await workspaceServices.getSharedWorkspaces(userId)
        return res.status(200).json({sharedWorkspace})
    } catch (error) {
        console.error('error happenend in sharedWorkspace controller fn',error);
        return res.status(500).json({message:'internal server error'})
        
    }

}





const getMemberWorkspaces = async (req, res) => {
    try {
        const userId = req.userId;
        const email = req.email; 
        
        if (!userId || !email) {
            return res.status(400).json({ message: 'User ID or email not provided' });
        }

        const workspaces = await workspaceServices.listWorkspaceByMember(userId, email);

        return res.status(200).json({ workspaces });
    } catch (error) {
        console.error('Error fetching member workspaces:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};





const getEachWorkspace = async (req, res) => {
    try {
        const { id: workspaceId } = req.params; 
        
        if (!workspaceId) {
            return res.status(400).json({ message: 'No workspace ID found' }); 
        }
        const workspacePanel = await workspaceServices.listEachWorkspace(workspaceId);
        if (!workspacePanel) {
            return res.status(404).json({ message: 'Workspace not found' }); 
        }
       
        return res.status(200).json({ workspace: workspacePanel }); 
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const inviteUserToWorkspace = async (req, res) => {
    const { userId, workspaceId } = req.body;

    try {
       
        await userModel.findByIdAndUpdate(userId, {
            $set: { isInvited: true },
            $push: { sharedWorkspaces: workspaceId }
        });

        
        await workspaceModel.findByIdAndUpdate(workspaceId, {
            $push: { invitedUsers: userId }
        });

        res.status(200).json({ message: 'User successfully invited to workspace' });
    } catch (error) {
        console.error('Error inviting user to workspace:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
  

  const addMembersToWorkspace = async (req, res) => {
    try {
        const { workspaceId, updateMembers } = req.body;

        if (!workspaceId || !updateMembers) {
            return res.status(400).json({ message: 'Workspace ID or members not provided' });
        }

        const updatedMembers = await workspaceServices.addMembersToWorkspace({
            workspaceId,
            updateMembers
        });

        return res.status(200).json({ updatedMembers });
    } catch (error) {
        console.error('Error adding members to workspace:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
const getAllWorkspaces = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ message: 'User ID not provided' });
        }

        const allWorkspaces = await workspaceServices.listAllWorkspaces(userId);

        return res.status(200).json({ allWorkspaces });
    } catch (error) {
        console.error('Error fetching all workspaces:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const getAllMembersByWorkspaceId = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const memberEmails = await workspaceServices.findMembersByWorkspaceId(workspaceId);
        return res.status(200).json(memberEmails); 
    } catch (error) {
        console.error("Error in getAllMembersByWorkspaceId:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteWorkspaceController = async (req, res) => {
    const workspaceId = req.params.id;
  
    try {
      await workspaceServices.deleteWorkspace(workspaceId);
      res.status(200).json({ message: 'Workspace deleted successfully' });
    } catch (error) {
      if (error.message === 'Workspace not found') {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Error deleting workspace:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };



export {
    createWorkspace,
    getWorkspaces,
    sharedWorkspace,
    getEachWorkspace,
    getMemberWorkspaces,
    // getInvitedWorkspaces,
    inviteUserToWorkspace,
    addMembersToWorkspace,
    getAllWorkspaces,
    getAllMembersByWorkspaceId,
    deleteWorkspaceController
}




























// import * as workspaceServices from '../services/workspaceServices.js'



// const createWorkspace = async(req,res)=>{
//     try {
//         const {name ,description} = req.body
//         const OwnerId = req.userId

//     const workspaceData = {name,description,OwnerId}
//     const workspace = await workspaceServices.getWorkspace(workspaceData)
//     return res.status(200).json({workspace})
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({message:'internal server error'})
        
//     }

// }


// const getWorkspaces = async (req, res) => {
//     try {
//         const {ownerId}=req.body;
//         console.log(ownerId,'ownerid')
//         if(!ownerId){
//         return res.status(500).json({ message: 'no userid  error' })

//         }
//             const worksm = await userServices.getWorkssss(ownerId)
//   
//         return res.status(200).json({ worksm })
//     } catch (error) {

//         console.error('error gettworkkks:', error);
//         return res.status(500).json({ message: 'internal server error' })
//     }
// }
// export {
//     createWorkspace
// }



// import * as workspaceServices from '../services/workspaceServices.js'
// import { workspaceModel } from "../model/workspaceModel.js"
// import { userModel } from "../model/userModel.js";



// const createWorkspace = async(req,res)=>{
//     try {
//         const {name ,description} = req.body
//         const OwnerId = req.userId

//     const workspaceData = {name,description,OwnerId}
//     const workspace = await workspaceServices.getWorkspace(workspaceData)
//     return res.status(200).json({workspace})
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({message:'internal server error'})
        
//     }

// }


// const getWorkspaces = async (req, res) => {
//     try {
//         // const {ownerId} = req.body;
//         console.log(req.userId,'ownerid')
//         const ownerId = req.userId;
        
//         if(!ownerId){
//         return res.status(500).json({ message: 'no userid  error' })
//         }

//         const workspace = await workspaceServices.listWorkspaceByOwner(ownerId)
       
//         return res.status(200).json({ workspace })
//     } catch (error) {
//         console.error('error gettworkkks:', error);
//         return res.status(500).json({ message: 'internal server error' })
//     }
// }

// //new in 11/24

// const getMemberWorkspaces = async (req, res) => {
//     try {
//         const userId = req.userId;
//         if (!userId) {
//             return res.status(400).json({ message: 'No user ID provided' });
//         }
//         const workspaces = await workspaceService.listWorkspaceByMember(userId);
//         return res.status(200).json({ workspaces });
//     } catch (error) {
//         console.error('Error fetching member workspaces:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };


// //new in 11/24
// const getInvitedWorkspaces = async (req, res) => {
//     try {
//         const userId = req.userId;
//         if (!userId) {
//             return res.status(400).json({ message: 'No user ID provided' });
//         }
//         const workspaces = await workspaceService.listInvitedWorkspaces(userId);
//         return res.status(200).json({ workspaces });
//     } catch (error) {
//         console.error('Error fetching invited workspaces:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };



// const getEachWorkspace = async (req, res) => {
//     try {
//         const { id: workspaceId } = req.params; 
        
//         if (!workspaceId) {
//             return res.status(400).json({ message: 'No workspace ID found' }); 
//         }
//         const workspacePanel = await workspaceServices.listEachWorkspace(workspaceId);
//         if (!workspacePanel) {
//             return res.status(404).json({ message: 'Workspace not found' }); 
//         }
//         return res.status(200).json({ workspace: workspacePanel }); 
//     } catch (error) {
//         console.error('Internal server error:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };


// // workspaceController.js

// // Function to invite a user to a workspace
// const inviteUserToWorkspace = async (req, res) => {
//     const { userId, workspaceId } = req.body;
  
//     try {
//       // Update the user to set isInvited to true and add the workspace to sharedWorkspaces
//       await userModel.findByIdAndUpdate(userId, {
//         $set: { isInvited: true },
//         $push: { sharedWorkspaces: workspaceId }
//       });
  
//       // Optionally, you can also update the workspace document to track invited users
//       await workspaceModel.findByIdAndUpdate(workspaceId, {
//         $push: { invitedUsers: userId }
//       });
  
//       res.status(200).json({ message: 'User successfully invited to workspace' });
//     } catch (error) {
//       console.error('Error inviting user to workspace:', error);
//       res.status(500).json({ error: 'Error inviting user to workspace' });
//     }
//   };
  
  


// export {
//     createWorkspace,
//     getWorkspaces,
//     getEachWorkspace,
//     getMemberWorkspaces,
//     getInvitedWorkspaces,
//     inviteUserToWorkspace
// }




















