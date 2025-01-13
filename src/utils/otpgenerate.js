import nodemailer from 'nodemailer'
import config from '../config/config.js';

export const otpGenerate = async(email)=>{
   const transporter = nodemailer.createTransport({
      service:'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user:config.EMAIL,
        pass:config.APP_PASSWORD,
      },
    });

    let otp = Math.floor(1000 + Math.random() * 9000)

  
    const info = await transporter.sendMail( {
      from: '"planIt" <lakshmijaya2912@gmail.com>', 
      to: email, 
      subject: "Your One-Time Password (OTP) for Secure Login", 
      text: `Your OTP for login is ${otp}`, 
      html: `<h2> OTP for login </h2>
      <p>Your OTP for login in planIt <strong>${otp}</strong></p>`, 
    })
    
 
    return otp

}