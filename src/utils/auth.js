const jwt = require('jsonwebtoken');
require('dotenv').config();

export const signAccessToken = async (
  data
) => {
  return new Promise(
    (resolve, reject) => {
      jwt.sign(
        data,
        process.env.JWT_SECRET,
        function (error, token) {
          if (error) reject(error);
          resolve(token);
        }
      );
    }
  );
};
export const verifyAccessToken = (
  req,
  res,
  next
) => {
  try {
    // const headers =   const token = req.cookies.access_token;;
    // const token = headers?.split(" ")[1];
    const token =
      req.cookies.access_token;
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    return res.status(403).json({
      message:
        'access token not valid or expired',
    });
  }
};
