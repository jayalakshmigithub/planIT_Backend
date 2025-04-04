import jwt from 'jsonwebtoken';
import config from '../../config/config.js';

const generateTokens = (res, payload) => {
  const accessToken = jwt.sign(
    { userId: payload.userId,userRole: payload.userRole },
    config.JWT_SECRET,
    { expiresIn: '1d' }
  );

  const refreshToken = jwt.sign(
    { userId: payload.userId ,userRole: payload.userRole},
    config.JWT_SECRET,
    { expiresIn: '30d' }
  );

  const cookieName = payload.userRole === 'admin' ? 'adminRefreshToken' : 'userRefreshToken';
  console.log("cookieName",cookieName)
  res.cookie(cookieName, refreshToken, {
    httpOnly: true,
    // sameSite: 'strict',
    sameSite: 'none',

    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: true,
  });

  return { accessToken, refreshToken };
};

export { generateTokens };
