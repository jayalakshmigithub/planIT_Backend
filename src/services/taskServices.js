import * as taskRepository from '../repository/TaskRepository.js'



const CreatTask = async(taskData)=>{
    try {
       const tasks =  await taskRepository.CreateTask(taskData)
        return tasks
    } catch (error) {
        console.error(error)
    } 
}


const getProjectTasks = async(projectId)=>{
    try {
        const tasks = await taskRepository.getTasks(projectId)
        return tasks
    } catch (error) {
        console.error('error occured in service layer ',error);
        
    }
}
const updateTaskStatus = async (taskId, status) => {
    try {
    
      const updatedTask = await taskRepository.updateTaskStatus(taskId, status);
  
      return updatedTask;
    } catch (error) {
      console.error('Error in service updateTaskStatus:', error);
      throw error;
    }
  };

export {
    CreatTask,
    getProjectTasks ,
    updateTaskStatus
}