import nodemailer from 'nodemailer'
import config from '../config/config'

export const generateInvitation = async(email)=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        host:"smtp.gmail.com",
        port:587,
        secure: false,
        auth:{
            user:config.EMAIL,
            pass:config.APP_PASSWORD
        },
    });

    
}