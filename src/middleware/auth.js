const allowedRoles = (roles) => {
  return (req, res, next) => {
    // roles  có kiễu dữ liệu là mảng
    // nếu ko phải array thì ko làm gì hết
    if (!Array.isArray(roles)) {
      req.session.path = req.url;
      return res.render("403");
    }

    // lặp mảng , chỉ cần match với 1 role thì next qua dc sử dụng quyền trong role đó
    const roleUser = req.session.user.role;
    // nếu ko có phần tử nào mach thì ko cho qua
    // roles kieu3 du lieu mang
    // ham some se lap deen khi nao dk == true thi dung tra ve true nguoc lai duyet den het mang ma2 tim khong thay thi  tra ve false
    if (!roles.some((role) => role === roleUser)) {
      req.session.path = req.url;
      return res.render("403");
    }

    // neu  role session.role !== admin && req.body.username !== session.role.username
    if (
      roleUser !== "admin" &&
      (req.body.username || req.params.username) !== req.session.user.username
    )
      return res.render("403");

    return next();
  };
};

const isLogin = (req, res, next) => {
  // neu ma ko dang nhap
  if (!req?.session?.user) {
    req.session.path = req.url;
    return res.redirect("/");
  }

  // dang nhap thanh cong thi cho phep
  return next();
};

export { allowedRoles, isLogin };
