const { exec } = require("../db/mysql");
const xss = require("xss");

const getList = () => {
  let sql = "select * from imgs where 1=1 ";
  return exec(sql);
};

const newImgs = ({ id, imgKey, imgList, description }) => {
  let sql = "";
  if (id) {
    sql = `update imgs set imgKey='${imgKey}', imgList='${imgList}', description='${description}' where id='${id}'`;
  } else {
    sql = `insert into imgs(imgKey, imgList, description) values ('${imgKey}', '${imgList}', '${description}')`;
  }

  return exec(sql);
};

const delImgs = (id = "") => {
  let sql = `delete from imgs where id in (${id})`;
  return exec(sql).then((data) => {
    return data.affectedRows;
  });
};

module.exports = {
  getList,
  newImgs,
  delImgs,
};
