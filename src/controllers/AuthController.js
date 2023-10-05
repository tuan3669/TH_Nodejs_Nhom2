import bcrypt from "bcrypt";
import connectDb from "../configs/connectDb";
import insertUser, { login } from "../models/user";

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) return res.redirect("/login");

  //  login model
  const [users, fields] = await login(username);

  // dang nhap ko tthanh cong nhap lai
  if (users.length < 0) return res.redirect("/login");

  // compare password
  const hashedPassword = users[0].password;

  const isMatched = bcrypt.compareSync(password, hashedPassword);

  // xoa key password ko can thiet tu ket qua CSDL
  delete users[0]["password"];
  console.log(users[0]);
  // mat khau khong khong
  if (!isMatched) return res.redirect("/login");

  // luu vao session dang object
  req.session.user = users[0];

  // neu lan ttruoc  co vao trang can authen thi chuyen vao ttrang do
  const path = req?.session?.path || "/";
  // xoa path cu di
  delete req?.session?.path;
  res.redirect(path);
};

const logout = async (req, res, next) => {
  delete req.session.user;
  delete req?.session?.path;

  res.redirect("/");
};

const registerUser = async (req, res, next) => {
  const { password } = req.body;

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  // model insert user
  const [user, fields] = insertUser(req.body, hashedPassword);
  if (user.affectedRows === 1) res.redirect("/");
};
export { loginUser, registerUser, logout };
