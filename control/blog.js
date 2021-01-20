const { exec, setSql } = require("../db/mysql");
const {dateFormat} = require("../utils/index");

const getList = ({
  id,
  type,
  title,
  author,
  content,
  orderKey,
  order,
  currentPage,
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
    orderKey: "createdTime",
    order,
    currentPage,
    pageSize,
  };
  return setSql(params);
};

const updateBlog = ({ id, type, title, description, content, src, author }) => {
  let sql = "";
  if (id) {
    sql = `update blogs set type='${type}', title='${title}', description='${description}', content='${content}', src='${src}', author='${author}', createdTime='${dateFormat("YYYY-DD-MM")}' where id='${id}'`;
  } else {
    sql = `insert into blogs(type, title,description, src, content, createdTime, author) values ('${type}', '${title}','${description}',   '${src}', '${content}', '${dateFormat("YYYY-DD-MM")}','${author}')`;
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
