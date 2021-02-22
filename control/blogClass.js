const { exec, setNoPageSql } = require("../db/mysql");
const getList = ({ name, curPage, pageSize }) => {
  const params = {
    name: "blogsclass",
  };
  return setNoPageSql(params);
};

const newClass = ({id,key,val,str}) => {
  let sql = "";
  if (id) {
    sql = `update blogsclass set ${str} where id='${id}';`;
  } else {
    sql = `insert into blogsclass(${key}) values (${val});`;
  }
  return exec(sql);
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
  deleteClass,
};
