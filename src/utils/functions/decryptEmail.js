const decryptEmail = (encryptedEmail) => {
    const decipher = crypto.createDecipher('aes-256-cbc', config.ENCRYPTION_KEY);
    let decryptedEmail = decipher.update(encryptedEmail, 'hex', 'utf8');
    decryptedEmail += decipher.final('utf8');
    return decryptedEmail;
  };
  export default decryptEmail