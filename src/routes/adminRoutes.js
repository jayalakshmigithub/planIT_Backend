import express from 'express';
import { verifyToken } from '../utils/middleware/authMiddleware.js';
import {adminLogin, blockUserAccount, projectList, unblockUserAccount, usersList, workspaceList} from '../controllers/adminController.js'

const adminRouter = express.Router()

adminRouter.post('/login',adminLogin);
adminRouter.get('/getusers',verifyToken,usersList);
adminRouter.post('/blockuser',verifyToken,blockUserAccount)
adminRouter.post('/unblockuser',verifyToken,unblockUserAccount)
adminRouter.get('/workspacelist',verifyToken,workspaceList)
adminRouter.get('/projectlist',verifyToken,projectList)
// adminRouter.get('/workspace/:id',verifyToken,WorkspaceById)
// adminRouter.post('/login',adminSignup)


export default adminRouter 