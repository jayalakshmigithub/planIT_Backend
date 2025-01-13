import * as projectServices from '../services/projectServices.js'
import * as notificationServices from '../services/notificationService.js'


const projectCreation = async(req,res)=>{
    try {
        const response = await projectServices.getProject(req.body)
        return res.status(200).json({response})
    } catch (error) {
        console.log(error,'in project controller')
        return res.status(500).json({message:"internal server error"})
        
    }
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



const getProjectsInWorkspace = async(req,res)=>{
    const {workspaceId} = req.params;
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

export{
    projectCreation,
    getProjectsInWorkspace,
    getEachProject,
   
    getProjectMembers

}