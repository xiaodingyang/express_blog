const { exec, setSql,setNoPageSql } = require("../db/mysql");

/* 获取菜单列表 */
// 分页
const getMenuList = ({ name, label, currentPage=1, pageSize=10 }) => {
  const params = {
    name: "menu",
    likeSearch: {
      name,
      label,
    },
    currentPage,
    pageSize,
  };
  return setSql(params);
};
// 不分页
const getMenu = ({ label }) => {
  const params = {
    name: "menu",
    likeSearch: {
      label,
    },
  };
  return setNoPageSql(params);
};

/* 更新菜单 */
const newMenu = ({ id,parentId,path,name,icon,label,auth,type  }) => {
    const data = { id,parentId,path,name,icon,label,auth,type  }
    let key = '',val = '',str = ''
      for (const k in data) {
         if(data[k]!==undefined){
            key+=','+k
            val +=`,"${data[k]}"`
            str += `,${k}="${data[k]}"`
         }
      }
  let sql = "";
  if (id) {
    sql = `update menu set ${str.slice(1)} where id='${id}';`;
  } else {
      
    sql = `insert into menu(${key.slice(1)}) values (${val.slice(1)});`;
    console.log(sql);

  }
  return exec(sql);
};
// /* 删除用户 */
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
