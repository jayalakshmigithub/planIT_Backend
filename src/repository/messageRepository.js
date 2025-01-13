import { Message } from "../model/message.js";

const createMessage = async (data, userId) => {
  try {
   

    const { message, chatId } = data;
    const newMessage = new Message({
      senderId: userId,
      content: message,
      chatRoomId: chatId,
    });

    const chat = (await newMessage.save()).populate({
      path: "senderId",
      model: "user",
      select: "name email",
    })
    
    return chat;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

const getMessages = async (chatId) => {
  try {
    const messages = await Message.find({ chatRoomId: chatId })
      .populate({
        path: "senderId",
        model: "user",
        select: "name email",
      })
      .exec();

    
    return messages;
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
};

export { createMessage, getMessages };
