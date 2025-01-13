import  mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", 
        required: true,
    },

    content: { type: String, required: true },
    chatRoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chatRoom",
        required: true,
    },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("messages", messageSchema);

export { Message };
