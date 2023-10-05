import express from "express";
import getHomePage from "../controllers/HomeController";
import getAboutPage from "../controllers/AboutController";
import { loginUser, logout } from "../controllers/AuthController";
import {
  createNewUser,
  detailUser,
  editUser,
  insertUser,
  listUser,
  login,
  register,
  updateUser,
  delUser,
} from "../controllers/UserController";

import api from "./apis/user";
import { isLogin, allowedRoles } from "../middleware/auth";
import { verifyAccessToken } from "../utils/auth";
const router = express.Router();

const initWebRoute = (app) => {
  router.get("/", getHomePage);
  router.get("/about", getAboutPage);

  // authenticatd user
  router.post("/login", loginUser);
  router.post("/insert-new-user", isLogin, insertUser);

  // them moi user
  router.get("/create-new-user", isLogin, createNewUser);

  // render page
  router.get("/login", login);
  router.get("/logout", logout);
  // router.get("/insert-new-user", register);
  router.get("/list-user/:page?", listUser);
  router.get(
    "/detail-user/:username?",
    isLogin,
    allowedRoles(["admin", "user"]),
    detailUser
  );
  router.post("/edit-user", isLogin, allowedRoles(["admin", "user"]), editUser);
  router.post(
    "/update-user",
    isLogin,
    allowedRoles(["admin", "user"]),
    updateUser
  );
  router.post("/del-user", isLogin, allowedRoles(["admin", "user"]), delUser);

  router.get((req, res) => {
    res.send("Lỗi 404, không tìm thấy trang");
  });

  // xay dung Api
  // ▪ Trả về danh sách tài khoản
  router.get("/api/v1/users", api.getAll);

  // ▪ Trả về thông tin tài khoản cụ thể
  // current user login
  router.get("/api/v1/users/detail", verifyAccessToken, api.detail);

  // ▪ Tạo tài khoản
  router.post("/api/v1/register", api.register);

  // ▪ Sửa tài khoản
  router.put("/api/v1/users", verifyAccessToken, api.edit);

  // ▪ Xóa tài khoản
  router.delete("/api/v1/users", verifyAccessToken, api.del);

  // ▪ Đăng nhập
  router.post("/api/v1/login", api.loginApi);

  // // ▪ Đăng xuất
  router.get("/api/v1/logout", api.logout);

  return app.use("/", router);
};

export default initWebRoute;
