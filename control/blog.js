const { exec, setSql } = require("../db/mysql");
const {dateFormat} = require("../utils/index");

const getList = ({
  id,
  type,
  title,
  author,
  content,
  order,
  curPage,
  pageSize,
}) => {
  const params = {
    name: "blogs",
    search: {
      id,
      type,
    },
    likeSearch: {
      title,
      author,
      content,
    },
    orderKey: "updateTime",
    order,
    curPage,
    pageSize,
  };
  return setSql(params);
};

const updateBlog = ({id,key,val,str}) => {
    let sql = "";
    if (id) {
      sql = `update blogs set ${str} where id='${id}';`;
    } else {
      sql = `insert into blogs(${key}) values (${val});`;
    }
    return exec(sql);
  };
const delBlog = (id = "") => {
  let sql = `delete from blogs where id in (${id})`;
  return exec(sql);
};

module.exports = {
  getList,
  updateBlog,
  delBlog,
};
