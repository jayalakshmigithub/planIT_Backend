import nodemailer from "nodemailer";
import crypto from "crypto";
import config from "../config/config.js";
import { saveToken } from "../repository/inviteRepository.js";
import encryptEmail from "../utils/functions/encryptEmail.js";


const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.EMAIL,
    pass: config.APP_PASSWORD,
  },
 
});



const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// const sendInvitation = async (email, workspaceId) => {
//   const encryptedEmail = encryptEmail(email);
//   const token = generateToken();
//   const invitationLink = `http://localhost:5173/signup?token=${token}&workspaceId=${workspaceId}&email=${encryptedEmail}`;

//   const mailOptions = {
//     from: config.GMAIL_USER,
//     to: email,
//     subject: "You'have been Invited to join EASE",
//     html: `
//     <!DOCTYPE html>
//    <html>
//     <head>
//     <meta charset="UTF-8" />
//     <title>Workspace Invitation</title>
//     <style>
//     body{
//     background-colour:#f2f2f2
//     }
//     .invitation{
//     max-width:500px;
//     margin:0 auto;
//     padding: 20px;
//     background-color:#fff;
//     border-radius:5px;
//     box-shadow: 0 2px 4px rgba(0,0,0,0.3)
//     }
//             h1 {
//                 font-size: 24px;
//                 margin-bottom: 10px;
//               }
//               p {
//                 font-size: 16px;
//                 line-height: 1.5;
//                 margin-bottom: 20px;
//               }
//                 .button {
//                 display: inline-block;
//                 margin-right: 10px;
//                 padding: 10px 20px;
//                 border-radius: 5px;
//                 color: #fff;
//                 text-decoration: none;
//                 transition: background-color 0.3s ease;
//               }
//               .button.accept {
//                 background-color: #008000;
//               }
//               .button.accept:hover {
//                 background-color: #006600;
//               }
//               .button.accept {
//                 color: #fff;
//               }
//     </style>
// </head>
//   <body>
//          <div class="invitation">
//             <h1> Workspace Invitation</h1>
//                 <p>
//                   Hi, ${email},
//                     <br />
//                      You've been invited to join our workspace. Click the button below to confirm your acceptance.
//                 </p>
//           <div>
//                   <a
//                   class="button accept"
//                    href="${invitationLink}">Accept Invitation"
//                   </a>          
//           </div>

//         </div>
    
//    </body>
//    </html>
     
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     await saveToken({ email, token });

//     return { success: true, message: "Invitation sent successfully" };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// };


const sendInvitation = async (emails, workspaceId) => {
  const failedEmails = [];

  for(const email of emails){
  const encryptedEmail = encryptEmail(email);
  const token = generateToken();
  const invitationLink = `${config.API_URL}/signup?token=${token}&workspaceId=${workspaceId}&email=${encryptedEmail}`;
  const mailOptions = {
    from: config.GMAIL_USER,
    to: email,
    subject: "You'have been Invited to join planIt",
    html: `
    <!DOCTYPE html>
   <html>
    <head>
    <meta charset="UTF-8" />
    <title>Workspace Invitation</title>
    <style>
    body{
    background-colour:#f2f2f2
    }
    .invitation{
    max-width:500px;
    margin:0 auto;
    padding: 20px;
    background-color:#fff;
    border-radius:5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3)
    }
            h1 {
                font-size: 24px;
                margin-bottom: 10px;
              }
              p {
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
              }
                .button {
                display: inline-block;
                margin-right: 10px;
                padding: 10px 20px;
                border-radius: 5px;
                color: #fff;
                text-decoration: none;
                transition: background-color 0.3s ease;
              }
              .button.accept {
                background-color: #008000;
              }
              .button.accept:hover {
                background-color: #006600;
              }
              .button.accept {
                color: #fff;
              }
    </style>
</head>
  <body>
         <div class="invitation">
            <h1> Workspace Invitation</h1>

                <p>
                  Hi, ${email},
                    <br />
                     You've been invited to join our workspace. Click the button below to confirm your acceptance.
                </p>
          <div>
                  <a
                  class="button accept"
                   href="${invitationLink}">Accept Invitation
                  </a>          
          </div>

        </div>
    
   </body>
   </html>
     
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    await saveToken({ email, token });

    // return { success: true, message: "Invitation sent successfully" };
  } catch (error) {
    failedEmails.push(email)
    // return { success: false, message: error.message };
    
  }}
  if(failedEmails.length>0){
    return { success:false,message:`failed to send invitation to : ${failedEmails.join(", ")}`}
  }else{
    return {success:true, message:"all invitaion sent successfully"}
  }
};

export default sendInvitation;

{

}
