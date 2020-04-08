const { exec } = require("../db/mysql");

/* 获取基础简历 */
const getResumeBase = () => {
  let sql = `select * from resumebase where 1=1 `;
  return exec(sql);
};
/* 删除基础简历 */
const delResumeBase = (id = "") => {
  let sql = `delete from resumebase where id in (${id})`;
  return exec(sql).then((data) => {
    return data.affectedRows;
  });
};
/* 更新基础简历 */
const updateResumeBase = ({
  id,
  aboutMe,
  expectedJob,
  expectedAddress,
  expectedSalary,
  currentStatus,
  schoolName,
  schoolNature,
  schoolHonou,
  jobExperience,
  skillLists,
}) => {
  let sql = "";
  if (id) {
    sql = `update resumebase set aboutMe='${aboutMe}', expectedJob='${expectedJob}', expectedAddress='${expectedAddress}', expectedSalary='${expectedSalary}', currentStatus='${currentStatus}', schoolName='${schoolName}', schoolNature='${schoolNature}', schoolHonou='${schoolHonou}', jobExperience='${jobExperience}', skillList='${skillLists}' where id='${id}';`;
  } else {
    sql = `insert into resumebase(aboutMe, expectedJob, expectedAddress, expectedSalary, currentStatus, schoolName, schoolNature, schoolHonou, jobExperience, skillList) values ('${aboutMe}', '${expectedJob}', '${expectedAddress}', '${expectedSalary}', '${currentStatus}', '${schoolName}', '${schoolNature}', '${schoolHonou}', '${jobExperience}', '${skillLists}')`;
  }
  return exec(sql)
    .then((data) => data)
    .catch((err) => err);
};

/* 获取经验 */
const getResumeEx = ({ companyName }) => {
  let sql = `select * from resumeex where 1=1 `;
  if (companyName) sql += `and companyName like '%${companyName}%' `;
  return exec(sql);
};
/* 删除经验 */
const delResumeEx = (id = "") => {
  let sql = `delete from resumeex where id in (${id})`;
  return exec(sql).then((data) => {
    return data.affectedRows;
  });
};
/* 更新经验 */
const updateResumeEx = ({ id, companyName, timeList, salary, experiences }) => {
  let sql = "";
  const experience = escape(experiences);
  if (id) {
    sql = `update resumeex set companyName='${companyName}', timeList='${timeList}', salary='${salary}', experience='${experience}' where id='${id}';`;
  } else {
    sql = `insert into resumeex(companyName, timeList, salary,experience) values ('${companyName}', '${timeList}', '${salary}', '${experience}')`;
  }
  return exec(sql)
    .then((data) => data)
    .catch((err) => err);
};

module.exports = {
  getResumeBase,
  getResumeEx,
  updateResumeBase,
  updateResumeEx,
  delResumeBase,
  delResumeEx,
};
