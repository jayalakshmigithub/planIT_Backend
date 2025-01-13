import express from 'express';
import { sendInvitationController, verifyInvitationController } from '../controllers/inviteController.js';

const invitationRoutes = express.Router();

invitationRoutes.post('/invite', sendInvitationController);
invitationRoutes.get('/verify', verifyInvitationController);

export default invitationRoutes;
