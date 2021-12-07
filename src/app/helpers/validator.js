import $ from "jquery";
import { fetchHelper } from "./fetch_helper";

export const validator = {
  is_busy: false,

  callback: null,

  isEmail: function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },

  isNumber: function(str) {
    return isNaN(str) ? false : true;
  },

  isBank: function(str) {
    return /^[\d+\- ]*$/gi.test(str);
  },

  isEmpty: function(str) {
    if (str === undefined) return true;
    str = str.toString();
    return str.replace(/^\s+/g, "").length ? false : true;
  },

  isMax: function(str, ln) {
    return str.length <= ln;
  },

  isMin: function(str, ln) {
    return str.length >= ln;
  },

  isEqual: function(str1, str2) {
    return str1 === str2;
  },

  isName: function(str) {
    return /^[a-zA-Z\u0161\u0111\u010D\u0107\u017E  \-\. ]+$/gi.test(str);
  },

  isAddress: function(str) {
    return /^[a-z0-9\u0161\u0111\u010D\u0107\u017E  \-\.\/ ]+$/gi.test(str);
  },

  isPhone: function(str) {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
      str
    );
  },

  isExist: function(name, value, route, callback) {
    if (!value) return false;
    if (!value.trim()) return false;
    var post = {};
    post[name] = value;
    this.is_busy = true;
    fetchHelper.fetch(route, post, callback);
  },

  isDate(value) {
    var date = false;

    if (value) {
      var d = Date.parse(value);

      if (isNaN(d)) {
        var e = value.split("-");
        d = e[2] + "-" + e[1] + "-" + e[0];
        d = Date.parse(d);
      }

      if (isNaN(d)) {
        var e = value.split(".");
        d = e[2] + "-" + e[1] + "-" + e[0];
        d = Date.parse(d);
      }

      if (isNaN(d)) {
        var e = value.split("/");
        d = e[2] + "-" + e[1] + "-" + e[0];
        d = Date.parse(d);
      }

      if (isNaN(d)) {
        var e = value.split(" ");
        d = e[2] + "-" + e[1] + "-" + e[0];
        d = Date.parse(d);
      }

      if (validator.isNumber(d)) {
        var n = new Date(d).getTime();
        var f = new Date().getTime();
        if (f > n) date = true;
      }
    }

    return date;
  },

  validate: function(jqueryObj) {
    jqueryObj.closest(".form-group").removeClass("error");
    jqueryObj
      .closest(".form-group")
      .find("span.error")
      .removeClass("active");
    jqueryObj.removeClass("error");

    var value = jqueryObj.val();
    var isValid = true;
    var isAsync = false;
    var d = jqueryObj.data("valid");
    if (d != undefined) {
      var validations = d.split(",");
      if (validations.length) {
        validations.map(f => {
          if (isValid) {
            var minmax = null;
            if (f == "isMin") minmax = jqueryObj.data("min");
            if (f == "isMax") minmax = jqueryObj.data("max");

            if (f == "isExist") {
              isAsync = true;
              var route = jqueryObj.data("route");
              this.isExist(
                jqueryObj.attr("name"),
                value,
                route,
                r => {
                  this.is_busy = false;
                  if (r.status == true) {
                    isValid = false;
                    jqueryObj.closest(".form-group").addClass("error");
                    jqueryObj.addClass("error");
                    jqueryObj
                      .closest(".form-group")
                      .find(".error.isExist")
                      .addClass("active");
                  } else {
                    if (this.callback) this.callback(r.status ? false : true);
                    this.callback = null;
                  }
                },
                jqueryObj
              );
            } else {
              if (f == "isEqual") {
                var value2 = $("body")
                  .find(jqueryObj.data("eq"))
                  .val();
                if (!this[f](value, value2)) {
                  isValid = false;
                  jqueryObj.closest(".form-group").addClass("error");
                  jqueryObj.addClass("error");
                  $("body")
                    .find(jqueryObj.data("eq"))
                    .addClass("error");
                  jqueryObj
                    .closest(".form-group")
                    .find(".error." + f)
                    .addClass("active");
                }
              } else {
                if (f !== "isEmpty") {
                  if (!this[f](value, minmax)) {
                    isValid = false;
                    jqueryObj.closest(".form-group").addClass("error");
                    jqueryObj.addClass("error");
                    jqueryObj
                      .closest(".form-group")
                      .find(".error." + f)
                      .addClass("active");
                  }
                } else {
                  if (this[f](value, minmax)) {
                    isValid = false;
                    jqueryObj.closest(".form-group").addClass("error");
                    jqueryObj.addClass("error");
                    jqueryObj
                      .closest(".form-group")
                      .find(".error." + f)
                      .addClass("active");
                  }
                }
              }
            }
          }
        });
      }
    }

    return isValid;
  },

  validateInputs(form, fields) {
    form.find(".form-error").remove();
    var inputs = form.find("input,select");
    inputs.removeClass("error");

    return new Promise((resolve, rejected) => {
      var hasErrors = false;

      $.each(inputs, (a, e) => {
        var inp = $(e);
        var group = inp.closest(".form-group");
        var name = inp.attr("name");
        var value = fields[name];

        var validation = inp.attr("validate");
        if (validation !== undefined) {
          var validate = validation.split("|");
          $.each(validate, (y, x) => {
            switch (x) {
              case "empty":
                if (validator.isEmpty(value)) {
                  if (!group.find(".form-error").length) {
                    group.append(
                      '<div class="form-error">' + inp.data("empty") + "</div>"
                    );
                    inp.addClass("error");
                    hasErrors = true;
                  }
                }
                break;
              case "name":
                if (!validator.isName(value)) {
                  if (!group.find(".form-error").length) {
                    group.append(
                      '<div class="form-error">' + inp.data("error") + "</div>"
                    );
                    inp.addClass("error");
                    hasErrors = true;
                  }
                }
                break;
              case "phone":
                if (!validator.isPhone(value)) {
                  if (!group.find(".form-error").length) {
                    group.append(
                      '<div class="form-error">' + inp.data("error") + "</div>"
                    );
                    inp.addClass("error");
                    hasErrors = true;
                  }
                }
                break;
              case "number":
                if (!validator.isNumber(value)) {
                  if (!group.find(".form-error").length) {
                    group.append(
                      '<div class="form-error">' + inp.data("error") + "</div>"
                    );
                    inp.addClass("error");
                    hasErrors = true;
                  }
                }
                break;
              case "email":
                if (!validator.isEmail(value)) {
                  if (!group.find(".form-error").length) {
                    group.append(
                      '<div class="form-error">' + inp.data("error") + "</div>"
                    );
                    inp.addClass("error");
                    hasErrors = true;
                  }
                }
                break;
              case "max":
                if (validator.isMin(value, inp.data("max"))) {
                  if (!group.find(".form-error").length) {
                    group.append(
                      '<div class="form-error">' + inp.data("error") + "</div>"
                    );
                    inp.addClass("error");
                    hasErrors = true;
                  }
                }
                break;
              case "min":
                if (validator.isMax(value, inp.data("min"))) {
                  if (!group.find(".form-error").length) {
                    group.append(
                      '<div class="form-error">' + inp.data("error") + "</div>"
                    );
                    inp.addClass("error");
                    hasErrors = true;
                  }
                }
                break;
              default:
                break;
            }
          });
        }
      });
      setTimeout(() => {
        hasErrors ? resolve(false) : resolve(true);
        return hasErrors;
      }, 400);
    });
  }
};
