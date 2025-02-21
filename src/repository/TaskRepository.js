import {taskModel }from '../model/taskModel.js';
import { projectModel } from '../model/projectModel.js';
import mongoose from 'mongoose';







const CreateTask = async (taskData) => {
    try {
       
        const assignees = Array.isArray(taskData.assignee) ? taskData.assignee.map((user) => ({
            userId: new mongoose.Types.ObjectId(user._id),  
            email: user.email, 
        })) : [];
        console.log('Task data received in repository:', taskData);
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
        console.log('savedtask',saveTask)

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
            .populate({
                path:'statusHistory.changedBy',
                select:'_id name'
            })
            .select('name Description priority status assignee images statusHistory');  
        return tasks;
    } catch (error) {
        console.error("Error fetching tasks for project:", error);
        throw error;
    }
};

// const updateTaskStatus = async (taskId, status) => {
//     try {
     
//       const updatedTask = await taskModel.findByIdAndUpdate(
//         taskId,
//         { status }, 
//         { new: true }
//       );
  
//       if (!updatedTask) {
//         throw new Error('Task not found');
//       }
  
//       return updatedTask;
//     } catch (error) {
//       console.error('Error in updating task status:', error);
//       throw error;
//     }
//   };

// const updateTaskStatus = async (taskId, status ,userId) => {
//     try {
     
//       const updatedTask = await taskModel.findByIdAndUpdate(
//         taskId,
//         {
//             $set: { status },  // Update the status field
//             $push: { 
//                 statusHistory: {
//                     status, 
//                     changedBy: userId, 
//                     changedAt: new Date()
//                 } 
//             }
//         },
//         { new: true }
//       );
  
//       if (!updatedTask) {
//         throw new Error('Task not found');
//       }
  
//       return updatedTask;
//     } catch (error) {
//       console.error('Error in updating task status:', error);
//       throw error;
//     }
//   };

// const updateTaskStatus = async (taskId, status, userId) => {
//     try {
      
  
//       const updatedTask = await taskModel.findByIdAndUpdate(
//         taskId,
//         {
//           $push: {
//             statusHistory: {
//               status: status,
//               changedBy: userId,
//               changedAt: new Date(),
//             }
//           }
//         },
//         { new: true }
//       );
//       if (!updatedTask) {
//             throw new Error('Task not found');
//               }
          
//               return updatedTask;
//             } catch (error) {
//                   console.error('Error in updating task status:', error);
//                      throw error;
//                 }
     
//   };


  
  // Modified repository function with additional validation
//   const updateTaskStatus = async (taskId, status, userId) => {
//     try {
//       // First, ensure the document has a valid statusHistory array
//       await taskModel.updateOne(
//         { _id: taskId },
//         { $set: { statusHistory: [] } },
//         { upsert: false, setDefaultsOnInsert: true }
//       );
  
//       // Then update the status
//       const updatedTask = await taskModel.findByIdAndUpdate(
//         taskId,
//         {
//           $set: { status }, // Update the main status field
//           $push: {
//             statusHistory: {
//               status: status,
//               changedBy: userId,
//               changedAt: new Date(),
//             }
//           }
//         },
//         { 
//           new: true,
//           runValidators: true 
//         }
//       ).populate('statusHistory.changedBy', 'name');
  
//       if (!updatedTask) {
//         throw new Error('Task not found');
//       }
  
//       return updatedTask;
//     } catch (error) {
//       console.error('Error in updating task status:', error);
//       throw error;
//     }
//   }
  
const updateTaskStatus = async (taskId, status, userId) => {
    try {
     
      const task = await taskModel.findById(taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      
      const updatedTask = await taskModel.findByIdAndUpdate(
        taskId,
        {
          $set: { status }, 
          $push: {
            statusHistory: {
              status: status,
              changedBy: userId,
              changedAt: new Date(),
            }
          }
        },
        { 
          new: true,
          runValidators: true 
        }
      ).populate('statusHistory.changedBy', 'name');

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