const jwt = require("jsonwebtoken");

require("dotenv").config();
export const signAccessToken = async (data) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      process.env.JWT_SECRET,
      {
        expiresIn: "360s",
      },
      function (error, token) {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
};
export const verifyAccessToken = (req, res, next) => {
  try {
    const headers = req?.headers?.authorization;
    const token = headers?.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "access token not valid or expired",
    });
  }
};
