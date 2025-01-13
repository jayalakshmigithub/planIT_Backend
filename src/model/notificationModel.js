import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", 
      required: true,
    },
    // type: {
    //   type: String,
    //   enum: ["project"], 
    //   required: true,
    // },
    type: {
      type: String,
      required: true, 
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects", 
      default: null, 
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tasks",
      default: null, 
    },
    message: {
      type: String,
      required: true, 
    },
    isRead: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true } 
);

const notificationModel = mongoose.model("notifications", notificationSchema);
export { notificationModel };
