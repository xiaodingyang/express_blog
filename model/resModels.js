module.exports = class msgModel {
  constructor({ data, message, status, total, pageSize, curPage }) {
    if (data) this.data = data;
    if (total) this.total = total;
    if (pageSize) this.pageSize = pageSize;
    if (curPage) this.curPage = curPage;
    if (message) this.message = message;
    if (status) this.status = status;
  }
};
