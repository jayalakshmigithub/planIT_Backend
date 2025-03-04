import * as taskServices from "../services/taskServices.js";
import constants from "../utils/functions/constants.js";
import httpStatus from "../utils/functions/httpStatus.js";

const taskCreation = async (req, res, next) => {
  try {
    const files = req.files;
    const images = files.map((file) => {
      return file.location;
    });

    const taskData = {
      ...req.body,
      OwnerId: req.userId,
      images,
    };
    console.log(taskData, "taskDatatata");
    const response = await taskServices.CreatTask(taskData);
    return res.status(httpStatus.OK).json({ response });
  } catch (error) {
    console.error("error in task creation contorller", error);
    next(error)
  }
};

const fetchProjectTasks = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const tasks = await taskServices.getProjectTasks(projectId);
    return res.status(httpStatus.OK).json({ tasks });
  } catch (error) {
    console.error("error occured in fetchProjectTasks", error);
    next(error)
  }
};

const updateTaskStatus = async (req, res,next) => {
  try {
    const { taskId, status } = req.body;
    console.log('taskId in controller',taskId)
    const userId = req.userId
    if (!taskId || !status ||!userId) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Task ID and status are required" });
    }
    const updatedTask = await taskServices.updateTaskStatus(taskId, status,userId);
    res.status(httpStatus.OK).json({ message: "Task status updated", task: updatedTask });
  } catch (error) {
    console.error("Error in updateTaskStatus controller:", error);
   next(error)
  }
};

const editTask = async(req,res,next)=>{
  try {
   const {_id,...updatedtask} = req.body
   console.log(req.body,'reqbody task')
   if(!_id){
    return res.status(httpStatus.BAD_REQUEST).json({ message: constants.TASK.TASK_ID_REQUIRED});
   }
   const updatedTask = await taskServices.editTask(_id,updatedtask)
   if(!updatedTask){
    return res.status(httpStatus.NOT_FOUND).json({ message: constants.TASK.TASK_NOT_FOUND });
   }
   res.status(httpStatus.OK).json({ message: constants.TASK.TASK_UPDATE_SUCCESS, task: updatedTask });


  } catch (error) {
    console.error("Error in editTask controller:", error);
   next(error)


    
  }
}

export { taskCreation, fetchProjectTasks, updateTaskStatus ,editTask};
