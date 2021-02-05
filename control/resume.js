const { exec, setSql } = require("../db/mysql");

/* 获取基础简历 */
const getResumeBase = ({ currentPage, pageSize }) => {
  const params = {
    name: "resumebase",
    search: {},
    likeSearch: {},
    currentPage,
    pageSize,
  };
  return setSql(params);
};
/* 删除基础简历 */
const delResumeBase = (id = "") => {
  let sql = `delete from resumebase where id in (${id})`;
  return exec(sql).then((data) => {
    return data.affectedRows;
  });
};
/* 更新基础简历 */
const updateResumeBase = ({ id, key, val, str }) => {
	let sql = ''
	if (id) {
		sql = `update resumebase set ${str} where id='${id}';`
	} else {
		sql = `insert into resumebase(${key}) values (${val});`
	}
	return exec(sql)
}


/* 获取经验 */
const getResumeEx = ({ companyName, currentPage, pageSize }) => {
  const params = {
    name: "resumeex",
    search: {},
    likeSearch: { companyName },
    currentPage,
    pageSize,
  };
  return setSql(params);
};
/* 删除经验 */
const delResumeEx = (id = "") => {
  let sql = `delete from resumeex where id in (${id})`;
  return exec(sql).then((data) => {
    return data.affectedRows;
  });
};
/* 更新经验 */
const updateResumeEx = ({ id, key, val, str }) => {
	let sql = ''
	if (id) {
		sql = `update resumeex set ${str} where id='${id}';`
	} else {
		sql = `insert into resumeex(${key}) values (${val});`
	}
	return exec(sql)
}
module.exports = {
  getResumeBase,
  getResumeEx,
  updateResumeBase,
  updateResumeEx,
  delResumeBase,
  delResumeEx,
};
