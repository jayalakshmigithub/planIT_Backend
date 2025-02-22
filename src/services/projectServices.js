import * as projectRepository from '../repository/projectRepository.js';
import mongoose from 'mongoose';
import { userModel } from '../model/userModel.js';

const getProject = async (projectData) => {
    try {
        const project = await projectRepository.createProject(projectData);
        return project
        
    } catch (error) {
        console.error(error)
    }

}


const getProjectMembersEmails = async (projectId) => {
    try {
      return await projectRepository.getProjectMembersWithEmails(projectId);
    } catch (error) {
      console.error('Error in getProjectMembersEmails:', error);
      throw error;
    }
  };



const fetchProjectsByWorkspace = async(workspaceId)=>{
    try {
        const fetchProjects = await projectRepository.getProjects(workspaceId)

       
        return fetchProjects
    } catch (error) {
        console.error('error occured in fetchProjectsByWorkspace',error);
        throw error
        
        
    }
}

const listEachProject = async(projectId)=>{
    try {
        return await projectRepository.getEachProject(projectId)
    } catch (error) {
        console.log('error fetching project',error)
        throw error 
        
    }
}

// const addNewMembers = async(projectId,members)=>{
//     try {
//         const newMembers = await projectRepository.addNewMembers(projectId,members)
//         return newMembers
        
//     } catch (error) {
//         console.log('error adding members',error)
//         throw error
//     }
// }

// const addNewMembers = async (projectId, members) => {
//     try {
     
//       const project = await projectRepository.getProjectById(projectId);
//       console.log('membersadded?',project)
      
     
//       if (!project) {
//         return null;
//       }
  
    
//       const existingEmails = project.members.map(member => member.email);
  
    
//       const newMembers = members
//         .filter(member => !existingEmails.includes(member)) 
//         .map(member => ({ _id: new mongoose.Types.ObjectId(), email: member }));
  
//       project.members.push(...newMembers);
//   console.log('projectsvaed',project)
//       return await project.save();
//     } catch (error) {
//       console.log('Error adding members:', error);
//       throw error; 
//     }
//   };

const addNewMembers = async (projectId, memberEmails) => {
  try {
      const project = await projectRepository.getProjectById(projectId);
      
      if (!project) {
          return null;
      }

      // Find the full user documents for the member emails
      const newMemberUsers = await userModel.find({ email: { $in: memberEmails } });
      
      if (!newMemberUsers.length) {
          throw new Error('No valid users found for the provided emails');
      }

      // Get existing member IDs to check for duplicates
      const existingMemberIds = project.members.map(member => member._id.toString());

      // Filter out members that are already in the project
      const membersToAdd = newMemberUsers.filter(user => 
          !existingMemberIds.includes(user._id.toString())
      );

      // Add new members with their full user information
      project.members.push(...membersToAdd.map(user => ({
          _id: user._id,
          email: user.email,
          // Add any other relevant user fields you want to store
      })));

      // Save the updated project
      const updatedProject = await project.save();

      // Add project reference to each user's projects array
      await Promise.all(membersToAdd.map(user => 
          userModel.findByIdAndUpdate(
              user._id,
              { $addToSet: { projects: projectId } },
              { new: true }
          )
      ));

      return updatedProject;
  } catch (error) {
      console.log('Error adding members:', error);
      throw error;
  }
};
  const editProject = async (projectId, updatedData) => {
    try {
      const existingProject = await projectRepository.getProjectById(projectId);
      if (!existingProject) {
        return null; 
      }
  
      return await projectRepository.updateProject(projectId, updatedData);
    } catch (error) {
      throw new Error(error.message);
    }
  };

export{
    getProject,
    // fetchProjectsByWorkspaceWithMembers,
    fetchProjectsByWorkspace,
    listEachProject,
    getProjectMembersEmails,
    addNewMembers,
    editProject

}