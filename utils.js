const { format } = require("date-fns");
const formatDate = (date) => {
  return format(date, "hh.mm a dd.MM.yyyy");
};
module.exports = formatDate;
