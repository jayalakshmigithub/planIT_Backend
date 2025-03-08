const constants = {
    AUTH: {
        INVALID_EMAIL: "Invalid email",
        INVALID_PASSWORD: "Invalid password",
        USER_BLOCKED: "User is blocked, please contact admin to restore access",
        SIGNIN_SUCCESS: "User signed in successfully",
        USER_NOTFOUND : "User not found"
      },
    
      PROJECT: {
        CREATED: "Project created successfully",
        NOT_FOUND: "Project not found",
        INVALID_ID: "Invalid project ID",
        UPDATED: "Project updated successfully",
        MEMBERS_ADDED: "Members added successfully",
        NO_MEMBERS_FOUND: "No members found for this project",
        MEMBERS_REMOVED: "Members removed from project"
      },
    
      WORKSPACE: {
        INVALID_ID: "Invalid workspace ID",
      },
    
      CHATS: {
        ERROR_EXISTING_CHATROOM: "Error fetching existing chat room",
        ERROR_CREATING_CHATROOM: "Error creating chat room",
        ERROR_FETCHING_CHATROOM: "Error fetching chat room",
        CHATROOM_ID_REQUIRED: "Chat room ID is required",
        WORKSPACE_ID_REQUIRED: "Workspace ID is required",
        ERROR_FETCHING_CHATROOMS: "Error fetching chat rooms",
      },
    
      TASK: {
        TASK_ID_REQUIRED: "Task ID is required",
        ERROR_TASK_CREATION: "Error creating task",
        ERROR_UPDATING_TASK: "Error updating task status",
        ERROR_EDITING_TASK: "Error editing task",
        TASK_UPDATE_SUCCESS: "Task updated successfully",
        TASK_NOT_FOUND: "Task not found",
      },
    
      COMMON: {
        INTERNAL_SERVER_ERROR: "Something went wrong, please try again later",
      },
}

export default constants;