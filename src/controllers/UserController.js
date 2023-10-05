import bcrypt from "bcrypt";
import { insertUser as insertUserMd } from "../models/user";
import { listUser as listUserUserMd } from "../models/user";
import { detailUser as detailUserMd } from "../models/user";
import { updateUser as updateUserMd } from "../models/user";
import { delUser as delUserMd } from "../models/user";
export const createNewUser = (req, res) => {
  return res.render("home", { title: "Tạo tài khoản", page: "newUser" });
};
export const listUser = async (req, res) => {
  //
  const users = await listUserUserMd();
  return res.render("home", {
    title: "Danh sách tài khoản",
    page: "listUser",
    users: users.length > 0 ? users[0] : [],
  });
};

export const insertUser = async (req, res, next) => {
  try {
    const { password } = req.body;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // model insert user
    const [user, fields] = await insertUserMd(req.body, hashedPassword);
    console.log("user inser ", user);

    if (user.affectedRows === 1) res.redirect("/list-user");
  } catch (error) {
    res.redirect("/create-new-user");
  }
};

export const detailUser = async (req, res) => {
  try {
    console.log("req parm ", req.params.username);
    const [user, f] = await detailUserMd(req.params.username);
    console.log("detail user", user);
    res.render("home", {
      title: "Chi tiết người dùng",
      user: user.length > 0 ? user[0] : undefined,
      page: "detailUser",
    });
  } catch (error) {
    res.redirect("/");
  }
};
export const editUser = async (req, res) => {
  try {
    const [user, f] = await detailUserMd(req.body.username);
    console.log("edit user", req.body.username);

    res.render("home", {
      title: "trang edit",
      user: user.length > 0 ? user[0] : undefined,
      page: "editUser",
    });
  } catch (error) {
    res.redirect("/");
  }
};
export const updateUser = async (req, res) => {
  try {
    console.log("user update ", req.body);
    const [user, f] = await updateUserMd(req.body);
    if (user.affectedRows == 1) {
      return res.redirect("/list-user");
    }
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
};
export const delUser = async (req, res) => {
  try {
    console.log("dell user ", req.body);
    if (!req.body.username) res.redirect("/list-user");
    const [user, f] = await delUserMd(req.body.username);
    if (user.affectedRows == 1) {
      return res.redirect("/list-user");
    }
    return res.redirect("/list-user");
  } catch (error) {
    res.redirect("/list-user");
  }
};

export const login = (req, res) => {
  if (req.session.user) res.redirect("/");
  res.render("home", { title: "Đăng nhập", page: "login" });
};
export const register = (req, res) => {
  res.render("home", { title: "dang ky user", page: "register" });
};
