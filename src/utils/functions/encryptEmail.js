import crypto from 'crypto';
import config from '../../config/config.js';


const encryptEmail = (email) => {
  const cipher = crypto.createCipher('aes-256-cbc', config.ENCRYPTION_KEY);
  let encryptedEmail = cipher.update(email, 'utf8', 'hex');
  encryptedEmail += cipher.final('hex');
  return encryptedEmail;
};



export default
    encryptEmail
    

