import * as projectRepository from '../repository/projectRepository.js'

const getProject = async(projectData)=>{
    try {
        const project = await projectRepository.createProject(projectData)
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

export{
    getProject,
    // fetchProjectsByWorkspaceWithMembers,
    fetchProjectsByWorkspace,
    listEachProject,
    getProjectMembersEmails

}