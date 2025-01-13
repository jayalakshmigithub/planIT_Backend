import mongoose from "mongoose";



const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  assignee: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'user',
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  }],
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'projects',  
  },
  priority: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['ongoing','pending' ,'Completed'], 
    default: 'ongoing',
  },
  // pending: {
  //   type: Boolean,
  //   default: false,
  // },
  images:{
    type: Array,
  },
  OwnerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user',
    required :true
}
});

const taskModel = mongoose.model("tasks", taskSchema);
export { taskModel };
