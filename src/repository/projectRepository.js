import {projectModel} from '../model/projectModel.js'
import { workspaceModel } from '../model/workspaceModel.js'
import{ userModel} from '../model/userModel.js'
import mongoose from 'mongoose'




const createProject =async(projectData)=>{
    try {
        const workspace = await workspaceModel.findById(projectData.workspaceName);
        
        if (!workspace) {
            throw new Error("Workspace not found");
        }

        const newProject = new projectModel({
            projectName: projectData.projectName,
            Description: projectData.Description,
            workspaceName:projectData.workspaceName,
            members: projectData.members,
            fromDate:projectData.fromDate,
            toDate:projectData.toDate
        })
        const savedProject = await newProject.save()
        await workspaceModel.findByIdAndUpdate(
            {_id:projectData.workspaceName},
            {$push:{projects:savedProject._id}}
        )
        return 'project created successfully'
    } catch (error) {
        console.error('error in repo',error)
        throw error   
    }
}






const getProjectById = async (projectId) => {
    try {
      const project = await projectModel.findById(projectId);
      return project;
    } catch (error) {
      console.error('Error in getProjectById:', error);
      throw error;
    }
  };
  


  
  
  
  
  





const getProjects = async(workspaceId)=>{

    try {
        const workspace = await workspaceModel.findById(workspaceId)

        
        const projectIds = workspace.projects

        const projects = await projectModel.find({_id:{$in:projectIds}})
        return projects

    } catch (error) {
        console.error('error in get projects repo',error);
        throw error  
    }

}

const getEachProject = async(projectId)=>{
    try {
        const EachProject = await projectModel.findById(projectId)
        return EachProject
    } catch (error) {
        console.log(error,'error occured in EachProject')
        throw error
        
    }
}

export{
    createProject,
    getProjects,
    getEachProject,

    getProjectById,
   
}



















// const getProjectMembersWithEmails = async(projectId)=>{
//     try {
//         const project = await projectModel.findById(projectId).populate('members.userId','email');

//         console.log('projecttt in getting members email',project)
//         if (!project) {
//             throw new Error('Project not found');
//           }
//           const memberEmails = project.members.map(member => {
           
//             if (member.email) {
//               return member.email;
//             }
  
//             return member.userId?.email || null;
//           })
      
//           console.log('Member emails:', memberEmails);
//           return memberEmails;
//     } catch (error) {
//         console.log('error happened in getProjectMembersWithEmails', error)
//         throw error

        
//     }
//   }
// const getProjects = async(workspaceId)=>{

//     try {
//         const workspace = await workspaceModel.findById(workspaceId)

        
//         const projectIds = workspace.projects
//         const workspaceMembers = workspace.members;   

//         await projectModel.updateMany(
//           { _id: { $in: projectIds } },               
//           { $addToSet: { members: { $each: workspaceMembers } } } 
//         );

//         const projects = await projectModel.find({_id:{$in:projectIds}})
//         console.log('in repo projects',projects)
//         return projects

//     } catch (error) {
//         console.error('error in get projects repo',error);
//         throw error  
//     }

// }