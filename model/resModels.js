module.exports = class msgModel {
  constructor({ data, message, status, total, pageSize, currentPage }) {
    if (data) this.data = data;
    if (total) this.total = total;
    if (pageSize) this.pageSize = pageSize;
    if (currentPage) this.currentPage = currentPage;
    if (message) this.message = message;
    if (status) this.status = status;
  }
};
