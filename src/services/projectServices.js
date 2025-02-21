import * as projectRepository from '../repository/projectRepository.js';
import mongoose from 'mongoose';

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

const addNewMembers = async (projectId, members) => {
    try {
     
      const project = await projectRepository.getProjectById(projectId);
      console.log('membersadded?',project)
      
     
      if (!project) {
        return null;
      }
  
    
      const existingEmails = project.members.map(member => member.email);
  
    
      const newMembers = members
        .filter(member => !existingEmails.includes(member)) 
        .map(member => ({ _id: new mongoose.Types.ObjectId(), email: member }));
  
      project.members.push(...newMembers);
  console.log('projectsvaed',project)
      return await project.save();
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