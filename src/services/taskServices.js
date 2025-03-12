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
const updateTaskStatus = async (taskId, status,userId) => {
    try {
        console.log('taskId in service ',taskId)
      const updatedTask = await taskRepository.updateTaskStatus(taskId, status,userId);
  
      return updatedTask;
    } catch (error) {
      console.error('Error in service updateTaskStatus:', error);
      throw error;
    }
  };

  const editTask = async(taskId,updatedTask)=>{
    try {
        const existingTask = await taskRepository.getTaskById(taskId)
        if(!existingTask){
            return null
        }

        const updateTask = await taskRepository.updateTask(taskId,updatedTask)
        return updateTask


    } catch (error) {
        console.error('error in updating task service',error);
        throw error
        
        
    }
  }

  const deleteTask = async(taskId)=>{
    try {
        const task = await taskRepository.deleteTask(taskId)
        return task
    } catch (error) {
        console.error('error in deleting task service',error);
        throw error  
    }
  }
export {
    CreatTask,
    getProjectTasks ,
    updateTaskStatus,
    editTask,
    deleteTask
}