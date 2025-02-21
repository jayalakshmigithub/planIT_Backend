import * as projectServices from '../services/projectServices.js'
import * as notificationServices from '../services/notificationService.js'
import mongoose from 'mongoose'


const projectCreation = async(req,res)=>{
    try {
        const response = await projectServices.getProject(req.body)
        return res.status(200).json({response})
    } catch (error) {
        console.log(error,'in project controller')
        return res.status(500).json({message:"internal server error"})
        
    }
}






const getProjectsInWorkspace = async(req,res)=>{
    const {workspaceId} = req.params;
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
        return res.status(400).json({ message: "Invalid workspace ID" });
    }
    try {
       const projects = await projectServices.fetchProjectsByWorkspace(workspaceId)
       return res.status(200).json({projects})

    } catch (error) {
        console.error('error in getProjectsInWorkspace',error);
        return res.status(500).json({message:'internal server error'})
        
        
    }
}


const getProjectMembers = async (req, res) => {
    const projectId = req.params.id;
    try {
        const memberEmails = await projectServices.getProjectMembersEmails(projectId);
        if (!memberEmails.length) {
            return res.status(404).json({ message: 'No members found for this project' });
        }
        res.status(200).json(memberEmails);
    } catch (error) {
        console.error('Error in getProjectMembers:', error);
        if (error.message === 'Project not found') {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};




const getEachProject = async(req,res)=>{
    try {
        const {id : projectId} = req.params
        const projectOverview = await projectServices.listEachProject(projectId)
        if(!projectOverview){
            return res.status(404).json({message:'project not found'})
        }
        return res.status(200).json({ project: projectOverview })
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ message: 'Internal server error' });
        
    }
}

const addNewMembers = async(req,res)=>{
    try {
        // const {projectId} = req.params
        const {projectId,memberEmails} = req.body
        console.log('projectId,memberEmails',projectId,memberEmails)
        const newMembers = await projectServices.addNewMembers(projectId,memberEmails)
        console.log('newMembers',newMembers)
        if(!newMembers){
            return res.status(404).json({message:'members not found'})
            }
            return res.status(200).json({message:'members added successfully'})

    } catch (error) {
        console.error('Error in addNewMembers:', error);
        return res.status(500).json({ message: 'Internal server error' });  
    }
}

const editheProject = async (req, res) => {
    try {
      const { _id, ...updatedData } = req.body;
      console.log('reqqboddyy',req.body)
  
      if (!_id) {
        return res.status(400).json({ message: "Project ID is required" });
      }
  
      const updatedProject = await projectServices.editProject(_id, updatedData);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      res.status(200).json({ message: "Project updated successfully", updatedProject });
    } catch (error) {
      console.error("Error editing project:", error);
      res.status(500).json({ message: "Internal server error" });
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