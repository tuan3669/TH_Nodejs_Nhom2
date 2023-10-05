import { listUser as listUserUserMd } from "../../models/user";
import { delUser as delUserMd } from "../../models/user";
import { insertUser as insertUserMd } from "../../models/user";
import { detailUser as detailUserMd } from "../../models/user";
import { updateUser as updateUserMd } from "../../models/user";
import { login as loginMd } from "../../models/user";
import bcrypt from "bcrypt";
import { signAccessToken } from "../../utils/auth";
export const getAll = async (req, res) => {
  //
  const users = await listUserUserMd();
  return res.status(200).json({
    users: users.length > 0 ? users[0] : [],
    message: "get all user",
  });
};
export const edit = async (req, res) => {
  //
  const [user, f] = await updateUserMd(req.body);
  if (user.affectedRows <= 0) {
    return res.status(400).json({
      message: "khong the edit user",
    });
  }
  return res.status(200).json({
    message: "edit user success",
  });
};
export const del = async (req, res) => {
  //
  const [user, f] = await delUserMd(req.body.username);
  if (user.affectedRows <= 0) {
    return res.status(400).json({
      message: "Something Went Wrong",
    });
  }
  return res.status(200).json({
    message: "delete user succes",
  });
};
export const detail = async (req, res) => {
  //
  console.log("detai ", req.user);
  const [user, f] = await detailUserMd(req.user.username);
  if (user.length < 0) {
    return res.status(400).json({
      message: "user Not found",
    });
  }

  return res.status(200).json({
    message: "get current user account",
    user: user[0],
  });
};

export const register = async (req, res) => {
  //
  try {
    const { password } = req.body;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // model insert user
    const [user, fields] = await insertUserMd(req.body, hashedPassword);
    return res.status(200).json({
      message: "register success",
    });
  } catch (error) {
    // 409 duplicate  username
    res.status(409).json({
      message: error,
    });
  }
};
export const loginApi = async (req, res) => {
  //
  const { password, username } = req.body;
  const [user, fields] = await loginMd(username);
  const hashedPassword = user[0].password;

  const isMatched = bcrypt.compareSync(password, hashedPassword);
  if (!isMatched) return res.status(400).json({ message: "password no match" });
  // xoa key password ko can thiet tu ket qua CSDL
  delete user[0]["password"];

  // signt token
  const tokenUser = await signAccessToken({
    username: user[0].username,
    role: user[0].role,
  });

  return res.status(200).json({
    message: "login success",
    token: tokenUser,
    user,
  });
};

export const logout = async (req, res) => {
  // ham nay em viet choi , o duoi ong React chi can ko gui len accesstoken la dc
  return res.status(200).json({
    message: "logout success",
    token: null,
  });
};

export default { getAll, edit, del, register, detail, loginApi, logout };
