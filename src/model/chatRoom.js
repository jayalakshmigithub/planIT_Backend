

import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projects",
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  
  messageId: [{ type: mongoose.Schema.Types.ObjectId, ref: "messages" }],
});

const ChatRoom = mongoose.model("chatRoom", chatRoomSchema);
export { ChatRoom };
