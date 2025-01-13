import {taskModel }from '../model/taskModel.js';
import { projectModel } from '../model/projectModel.js';
import mongoose from 'mongoose';







const CreateTask = async (taskData) => {
    try {
       
        const assignees = Array.isArray(taskData.assignee) ? taskData.assignee.map((user) => ({
            userId: new mongoose.Types.ObjectId(user._id),  
            email: user.email, 
        })) : [];

        const newTask = new taskModel({
            name: taskData.name,
            Description: taskData.description,
            assignee: assignees,  
            priority: taskData.priority,
            projectId: taskData.projectId,
            OwnerId: taskData.OwnerId,
            images: taskData.images
        });

        const saveTask = await newTask.save();
        await projectModel.findByIdAndUpdate(
            { _id: taskData.projectId },
            { $push: { tasks: saveTask._id } }
        );

        return saveTask;
    } catch (error) {
        console.error('Error in repo', error);
        throw error;
    }
};

const getTasks = async (projectId) => {
    try {
        
        const tasks = await taskModel
            .find({ projectId })  
            .populate({
                path: 'assignee', 
                select: '_id email',  
            })
            .select('name Description priority status assignee');  
        return tasks;
    } catch (error) {
        console.error("Error fetching tasks for project:", error);
        throw error;
    }
};

const updateTaskStatus = async (taskId, status) => {
    try {
     
      const updatedTask = await taskModel.findByIdAndUpdate(
        taskId,
        { status }, 
        { new: true }
      );
  
      if (!updatedTask) {
        throw new Error('Task not found');
      }
  
      return updatedTask;
    } catch (error) {
      console.error('Error in updating task status:', error);
      throw error;
    }
  };
  
const findOwnerOfTask = async()=>{

}

export {
    CreateTask,
    getTasks,
    updateTaskStatus

}