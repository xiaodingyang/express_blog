const { exec, setSql } = require("../db/mysql");
const getList = ({ name, currentPage, pageSize }) => {
  const params = {
    name: "blogsclass",
    likeSearch: {
      name,
    },
    currentPage,
    pageSize,
  };
  return setSql(params);
};

const newClass = ({ code, name }) => {
  let sql = `insert into blogsclass(code, name) values ('${code}', '${name}')`;
  return exec(sql);
};

const updateClass = ({ code, name, id }) => {
  let sql = `update blogsclass set code='${code}', name='${name}' where id='${id}'`;
  return exec(sql).then((data) => {
    return data.affectedRows;
  });
};

const deleteClass = (id = "") => {
  let sql = `delete from blogsclass where id in (${id})`;
  return exec(sql).then((data) => {
    return data.affectedRows;
  });
};

module.exports = {
  getList,
  newClass,
  updateClass,
  deleteClass,
};
