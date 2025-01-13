import crypto from 'crypto';

const generateLink=(email,workspaceId)=>{
    const token = crypto.randomBytes(20).toString('hex')
    const invitationLink = `http://localhost:5173/invite?token=${token}&workspaceId=${workspaceId}&email=${email}`;

    return invitationLink;

}

export {generateLink}