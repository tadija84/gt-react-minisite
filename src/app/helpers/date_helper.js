export const DateHelper = {
  toEndDaySeconds: function() {
    var dt = DateHelper.dateNow();
    dt += " 23:59:59";

    var end = new Date(dt).getTime();

    var now = new Date().getTime();

    var f = end - now;
    if (f < 0) f = 0;

    return Math.round(f);
  },

  dateNow: function() {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    return year + "/" + month + "/" + day;
  },

  zeroPad: function(str) {
    if (str.toString().length === 1) {
      return "0" + str.toString();
    }
    return str;
  }
};
