import express from 'express'
import {signup,otpgenerate,otpVerify, signin,signinByGoogle, updateUserProfile,validateEmail,resetPassword,changePassword, getBlockStatus} from '../controllers/userController.js'
import {verifyToken} from '../utils/middleware/authMiddleware.js'
import { createWorkspace,getEachWorkspace,getWorkspaces ,inviteUserToWorkspace,sharedWorkspace,getAllMembersByWorkspaceId, deleteWorkspaceController} from '../controllers/workspaceController.js'
import { sendInvitationController, verifyInvitationController } from '../controllers/inviteController.js';
import { getProjectsInWorkspace, projectCreation ,getEachProject,getProjectMembers, addNewMembers, editheProject} from '../controllers/projectController.js';
import { fetchProjectTasks, taskCreation, updateTaskStatus } from '../controllers/taskController.js';
import { createChatRoomController, existingChatRoomController, fetchChatRoomsController, fetchChatRoomsWorkspaceController  } from '../controllers/chatRoomController.js';
// import { changePassword } from '../repository/userRepository.js';
// import { changePasswordController } from '../services/workspaceServices.js'
import { checkBlocked } from '../utils/middleware/checkUserBlocked.js';

import { changePasswordController } from '../controllers/userController.js';
import { createMessageController , fetchMessagesController} from '../controllers/messageController.js';
import upload from '../utils/functions/images.js';
import { getUserNotifications } from '../controllers/NotificationController.js';
import { editProject } from '../services/projectServices.js';
import { validateProjectAccess } from '../utils/middleware/validateProjectAccess.js';




const userRoutes = express.Router()

userRoutes.post('/signup',signup);
userRoutes.post('/signin',signin);

userRoutes.post('/otpgenerate',otpgenerate);
userRoutes.post('/verify-otp',otpVerify);
userRoutes.post('/signingoogle',signinByGoogle);
userRoutes.post('/create',verifyToken,checkBlocked,createWorkspace);
userRoutes.post('/invite', verifyToken,checkBlocked,sendInvitationController);
userRoutes.get('/verify', verifyInvitationController);
// userRoutes.get('/getworks', verifyToken,gettworkkks);
userRoutes.get('/workspaces',verifyToken,checkBlocked,getWorkspaces);
userRoutes.get('/workspace/:id',verifyToken,checkBlocked,getEachWorkspace);
// userRoutes.get('/project/:id',verifyToken.getEachProject)

userRoutes.post('/createproject',verifyToken,checkBlocked,projectCreation);
userRoutes.get('/projects/:id',verifyToken,checkBlocked,getEachProject);
userRoutes.get('/workspace/:id/members', verifyToken, checkBlocked,getAllMembersByWorkspaceId);
userRoutes.get('/projects/:id/members',verifyToken,checkBlocked,getProjectMembers);
userRoutes.put('/projects/edit-project/',verifyToken,checkBlocked,editheProject)

// userRoutes.post('/projects/:id/addmembers',verifyToken,checkBlocked,addNewMembers)
userRoutes.post('/projects/addmembers',verifyToken,checkBlocked,addNewMembers)


userRoutes.post('/invite', verifyToken,checkBlocked,inviteUserToWorkspace);
userRoutes.put('/updateprofile/:userId',verifyToken,checkBlocked,updateUserProfile);
userRoutes.get('/workspaces/:workspaceId/projects',verifyToken,checkBlocked,getProjectsInWorkspace);



userRoutes.post('/tasks',verifyToken,checkBlocked,upload.array("images",10), taskCreation);
userRoutes.get('/projects/:projectId/tasks',verifyToken,checkBlocked,fetchProjectTasks);
userRoutes.put('/tasks/status',verifyToken,checkBlocked,updateTaskStatus);


userRoutes.get('/chat',verifyToken,checkBlocked,existingChatRoomController);
userRoutes.post('/chat',verifyToken,checkBlocked,createChatRoomController);

userRoutes.get('/messages',verifyToken,checkBlocked,fetchMessagesController);
userRoutes.post('/messages',verifyToken,checkBlocked,createMessageController);

userRoutes.post('/changepassword',verifyToken,checkBlocked,changePasswordController);

userRoutes.delete('/workspaces/:id',verifyToken,checkBlocked,deleteWorkspaceController);

userRoutes.post('/verify-email',validateEmail);

userRoutes.post('/reset-password',resetPassword);

userRoutes.post('/change-password',verifyToken,checkBlocked,changePassword);

userRoutes.get('/chats/messages',verifyToken,checkBlocked,fetchChatRoomsController)

userRoutes.get('/chatrooms/:id',verifyToken,checkBlocked,fetchChatRoomsWorkspaceController)

userRoutes.get('/notifications',verifyToken,checkBlocked,getUserNotifications)







export default userRoutes  