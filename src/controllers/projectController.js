import * as projectServices from '../services/projectServices.js'
import * as notificationServices from '../services/notificationService.js'
import mongoose from 'mongoose'
import httpStatus from '../utils/functions/httpStatus.js'
import constants from '../utils/functions/constants.js'


const projectCreation = async(req,res,next)=>{
    try {
        const response = await projectServices.getProject(req.body)
        return res.status(httpStatus.OK).json({response})
    } catch (error) {
        console.log(error,'in project controller')
       next(error)
        
    }
}






const getProjectsInWorkspace = async(req,res,next)=>{
    const {workspaceId} = req.params;
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid workspace ID" });
    }
    try {
       const projects = await projectServices.fetchProjectsByWorkspace(workspaceId)
       return res.status(httpStatus.OK).json({projects})

    } catch (error) {
        console.error('error in getProjectsInWorkspace',error);
        next(error)
        
        
    }
}


const getProjectMembers = async (req, res, next) => {
    const projectId = req.params.id;
    try {
        const memberEmails = await projectServices.getProjectMembersEmails(projectId);
        if (!memberEmails.length) {
            return res.status(httpStatus.NOT_FOUND).json({ message: constants.PROJECT.NO_MEMBERS_FOUND });
        }
        res.status(httpStatus.OK).json(memberEmails);
    } catch (error) {
        console.error('Error in getProjectMembers:', error);
        if (error.message === 'Project not found') {
            return res.status(404).json({ message: constants.PROJECT.NOT_FOUND });
        }
       next(error)
    }
};




const getEachProject = async(req,res,next)=>{
    try {
        const {id : projectId} = req.params
        const projectOverview = await projectServices.listEachProject(projectId)
        if(!projectOverview){
            return res.status(httpStatus.NOT_FOUND).json({message: constants.PROJECT.NOT_FOUND})
        }
        return res.status(httpStatus.OK).json({ project: projectOverview })
    } catch (error) {
       next(error)
        
    }
}

// const addNewMembers = async(req,res)=>{
//     try {
//         // const {projectId} = req.params
//         const {projectId,memberEmails} = req.body
//         console.log('projectId,memberEmails',projectId,memberEmails)
//         const newMembers = await projectServices.addNewMembers(projectId,memberEmails)
//         console.log('newMembers',newMembers)
//         if(!newMembers){
//             return res.status(404).json({message:'members not found'})
//             }
//             return res.status(200).json({message:'members added successfully'})

//     } catch (error) {
//         console.error('Error in addNewMembers:', error);
//         return res.status(500).json({ message: 'Internal server error' });  
//     }
// }
const addNewMembers = async(req, res,next) => {
    try {
        const { projectId, memberEmails } = req.body;
        console.log('projectId,memberEmails', projectId, memberEmails);
        
        const newMembers = await projectServices.addNewMembers(projectId, memberEmails);
        
        if (!newMembers) {
            return res.status(httpStatus.NOT_FOUND).json({ message: constants.PROJECT.NOT_FOUND });
        }
        
        return res.status(httpStatus.OK).json({
            message: constants.PROJECT.MEMBERS_ADDED,
            project: newMembers
        });

    } catch (error) {
        console.error('Error in addNewMembers:', error);
        if (error.message === 'No valid users found for the provided emails') {
            return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
        }
        next(error)
    }
};

const editheProject = async (req, res,next) => {
    try {
      const { _id, ...updatedData } = req.body;
      console.log('reqqboddyy',req.body)
  
      if (!_id) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Project ID is required" });
      }
  
      const updatedProject = await projectServices.editProject(_id, updatedData);
      if (!updatedProject) {
        return res.status(httpStatus.NOT_FOUND).json({ message: constants.PROJECT.NOT_FOUND });
      }
  
      res.status(httpStatus.OK).json({ message: constants.PROJECT.UPDATED, updatedProject });
    } catch (error) {
      console.error("Error editing project:", error);
   next(error)
    }
  };

  



export{
    projectCreation,
    getProjectsInWorkspace,
    getEachProject,
   
    getProjectMembers,

    addNewMembers,
    editheProject

}




// const projectCreation = async(req,res)=>{
//     try {
//         const { workspaceName, projectName, Description, fromDate, toDate, members } = req.body;
//         const projectData = {
//             workspaceName,
//             projectName,
//             Description,
//             fromDate,
//             toDate,
//             members,
//           };
//           const response = await projectServices.getProject(projectData);
//           if (members && members.length > 0) {
//             for (const member of members) {
//               await notificationServices.addNotification({
//                 userId: member._id,
//                 type: "project",
//                 projectId: response._id, 
//                 message: `You have been assigned to the project: ${response.projectName}`,
//               });
//             }
//           }
      
//           return res.status(200).json({ message: "Project created successfully", response });
//     } catch (error) {
//         console.log(error,'in project controller')
//         return res.status(500).json({message:"internal server error"})
        
//     }
// }

//chnaged for notification
// const projectCreation = async (req, res) => {
//     try {
//         const { workspaceName, projectName, Description, fromDate, toDate, members } = req.body;

  
//         if (!workspaceName || !projectName || !members || !Array.isArray(members)) {
//             return res.status(400).json({ message: "Invalid input data" });
//         }

//         const projectData = {
//             workspaceName,
//             projectName,
//             Description,
//             fromDate,
//             toDate,
//             members,
//         };

       
//         const response = await projectServices.getProject(projectData);

       
//         if (members && members.length > 0) {
//             for (const member of members) {
//                 if (!member._id) {
//                     console.error("Invalid member ID in project creation");
//                     continue;
//                 }

//                 await notificationServices.addNotification({
//                     userId: member._id,
//                     type: "project",
//                     projectId: response._id,
//                     message: `You have been assigned to the project: ${response.projectName}`,
//                 });
              
//             }
//         }

//         return res.status(200).json({ message: "Project created successfully", response });
//     } catch (error) {
//         console.error("Error in project creation:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };