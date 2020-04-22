const { exec } = require("../db/mysql");

const { genPassword } = require("../utils/crypto");

const login = (username = "", password = "", req) => {
  password = genPassword(password);
  const sql = `select id,username,realname,auth,headImg from users where username='${username}' and password='${password}'`;
  return exec(sql).then((data) => {
    if (data && data[0]) {
      req.session.userInfo = {
        userId: data[0].id,
        username: data[0].username,
        password: password,
        realname: data[0].realname,
        headImg: data[0].headImg,
        auth: data[0].auth,
      };
    }
    return data[0] || {};
  });
};

/* 获取用户列表 */
const getUserInfo = ({ username, realname, auth }) => {
  let sql = `select * from users where 1=1 `;
  if (username) sql += `and username like '%${username}%' `;
  if (realname) sql += `and realname like '%${realname}%' `;
  if (auth) sql += `and auth = '${auth}'`;
  return exec(sql);
};

/* 查重 */
const isRepeat = (username) => {
  let sql = `select * from users where username = '${username}'`;
  return exec(sql);
};

/* 新增用户 */
const newUser = ({ id, username, password, realname, auth, headImg = "" }) => {
  password = genPassword(password);
  let sql = "";
  if (id) {
    sql = `update users set username='${username}' , auth='${auth}' , headImg='${headImg}' , realname='${realname}' where id='${id}';`;
  } else {
    sql = `insert into users(username, password, realname, auth, headImg) values ('${username}', '${password}', '${realname}', '${auth}', '${headImg}');`;
  }
  return exec(sql);
};
/* 删除用户 */
const deleteUser = (id) => {
  const sql = `delete from users where id in(${id});`;
  return exec(sql);
};

// 修改密码
const resetPassword = ({ password }, req) => {
  password = genPassword(password);
  sql = `update users set password='${password}' where id='${req.session.userInfo.userId}';`;
  return exec(sql);
};

module.exports = {
  login,
  getUserInfo,
  newUser,
  deleteUser,
  isRepeat,
  resetPassword,
};
