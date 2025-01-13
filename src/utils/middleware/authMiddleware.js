import jwt from 'jsonwebtoken';
import config from '../../config/config.js';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided!' });
  }

  const accessToken = token.split(' ')[1];

  jwt.verify(accessToken, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized!' });
    }
    if (decoded) {
      req.userId = decoded.userId;
    } else {
      console.log('rerror at middlearwe')

      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    next();
  });
};



export { verifyToken };
