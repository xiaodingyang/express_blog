const { exec, setSql } = require("../db/mysql");
// const xss = require("xss");

const getList = ({ imgKey, description, curPage, pageSize }) => {
  const params = {
    name: "imgs",
    likeSearch: {
      imgKey,
      description,
    },
    curPage,
    pageSize,
  };
  return setSql(params);
};

const newImgs = ({ id, key, val, str }) => {
	let sql = ''
	if (id) {
		sql = `update imgs set ${str} where id='${id}';`
	} else {
		sql = `insert into imgs(${key}) values (${val});`
	}
	return exec(sql)
}

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
