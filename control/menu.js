const { exec, setSql,setNoPageSql } = require("../db/mysql");

/* 获取菜单列表 */
// 分页
const getMenuList = ({ name, label, curPage=1, pageSize=10 }) => {
  const params = {
    name: "menu",
    likeSearch: {
      name,
      label,
    },
    order:'asc',
    orderKey:'sort',
    
  };
  return setNoPageSql(params);
};
// 不分页
const getMenu = ({ label }) => {
  const params = {
    name: "menu",
    order:'asc',
    orderKey:'sort',
    likeSearch: {
      label,
    },
  };
  return setNoPageSql(params);
};

/* 更新菜单 */
const newMenu = ({id,key,val,str}) => {
  let sql = "";
  if (id) {
    sql = `update menu set ${str} where id='${id}';`;
  } else {
    sql = `insert into menu(${key}) values (${val});`;
  }
  return exec(sql);
};
// /* 删除菜单 */
const delMenu = (id) => {
  const sql = `delete from menu where id in(${id});`;
  return exec(sql);
};


module.exports = {
    getMenuList,
    getMenu,
    newMenu,
    delMenu

};
