import connectDb from '../configs/connectDb';
import bcrypt from 'bcrypt';
//
const insertUser = async (
  body,
  hashedPassword
) => {
  try {
    const {
      username,
      fullname,
      address,
      sex,
      email,
      groupid,
    } = body;
    const db = await connectDb();
    return await db.execute(
      'INSERT INTO `users`(username, fullname, address,sex,password,email,groupid) VALUES (? ,? ,? ,? ,? ,? ,? )',
      [
        username,
        fullname,
        address,
        sex,
        hashedPassword,
        email,
        +groupid,
      ]
    );
  } catch (error) {
    throw error;
  }
};
const listUser = async (
  body,
  hashedPassword
) => {
  try {
    const db = await connectDb();
    return await db.execute(
      'SELECT  users.username, users.fullname, users.address, users.sex, users.password, users.email, users.groupid FROM users INNER JOIN `group` ON users.groupid = `group`.id'
    );
  } catch (error) {
    console.log('err ', error);
  }
};
const detailUser = async (username) => {
  try {
    const db = await connectDb();
    return await db.execute(
      'SELECT users.username, users.fullname, users.address, users.sex, users.email, users.groupid FROM `users` INNER JOIN `group` ON users.groupid = `group`.id WHERE users.username = ?',
      [username]
    );
  } catch (error) {
    console.log('err ', error);
  }
};
const delUser = async (username) => {
  try {
    const db = await connectDb();
    return await db.execute(
      'DELETE  FROM `users`  WHERE users.username = ?',
      [username]
    );
  } catch (error) {
    console.log('err ', error);
  }
};
const login = async (username) => {
  try {
    const db = await connectDb();
    //
    return await db.execute(
      'SELECT  users.*, group.role FROM `users` INNER JOIN `group` ON users.groupid = `group`.id where username = ? ',
      [username]
    );
  } catch (error) {
    console.log('err ', error);
  }
};

const updateUser = async (body) => {
  try {
    const db = await connectDb();
    const {
      fullname,
      password,
      address,
      sex,
      email,
      groupid,
      username,
    } = body;
    let sql =
      'UPDATE `users` SET fullname = ?, address = ?, sex = ?, password = ?,email = ?,groupid = ? WHERE username = ?';

    if (!password) {
      sql =
        'UPDATE `users` SET fullname = ?, address = ?, sex = ?,email = ?,groupid = ? WHERE username = ?';

      return await db.execute(sql, [
        fullname,
        address,
        sex,
        email,
        groupid,
        username,
      ]);
    } else {
      const saltRounds = 10;
      const salt =
        bcrypt.genSaltSync(saltRounds);
      const hashedPassword =
        bcrypt.hashSync(password, salt);
      return await db.execute(sql, [
        fullname,
        address,
        sex,
        hashedPassword,
        email,
        groupid,
        username,
      ]);
    }
  } catch (error) {
    console.log('err ', error);
  }
};
export {
  insertUser,
  listUser,
  detailUser,
  updateUser,
  delUser,
  login,
};
