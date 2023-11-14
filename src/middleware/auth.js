const jwt = require("jsonwebtoken");
import dotenv from "dotenv";
dotenv.config();

const allowedRoles = (roles = ['admin']) => {
  return (req, res, next) => {


    const roleUser = req.user.role;
    
    if (!roles.some((role) => role === roleUser)) {
      return res.status(403).json({
        message: "role not allowed",
      });
    }

    
    return next();
  };
};

const isLogin = (req, res, next) => {
 

  const token =   req.cookies.access_token;
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decode;

  if(!decode) return res.status(403).json({
    message : 'token is required'
  })

  return next();
};

export { allowedRoles, isLogin };
