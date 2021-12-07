import { fetchHelper } from "./fetch_helper";
import $ from "jquery";

export const FormHelper = {
  matches: {},

  forms: {},

  isBusy: false,

  parent: null,

  Find: function(str, p) {
    this.parent = p;

    this.matches = {};

    var match = str.match(/\{\{form\((\d+)\)\}\}/gi);

    if (match)
      if (match.length) {
        for (var i = 0; i < match.length; i++) {
          var m = match[i].replace(/ /g, "");
          var intids = m.match(/\d+/);
          if (intids.length) {
            var id = parseInt(intids[0]);

            if (Number.isInteger(id)) {
              this.matches[id] = m;
              var html =
                '<div class="noselect form-container loading" id="form-' +
                id +
                '" ><div>';
              var replace = "\\{\\{form\\(" + id + "\\)\\}\\}";
              var re = new RegExp(replace, "g");
              str = str.replace(re, html);
            }
          }
        }
      }

    if (Object.keys(this.matches).length) {
      var fData = [];
      Object.keys(this.matches).map(e => {
        fData.push(e);
      });
      setTimeout(() => {
        fetchHelper.fetch("core/form/get", { form: fData }, r => {
          if (r.status) {
            this._inject_forms(r.form);
          }
        });
      }, 1000);
    }
    return str;
  },

  _inject_forms: function(forms) {
    Object.keys(forms).map(id => {
      var form = forms[id];
      this.forms[id] = form;
      this.forms[id].submiturl = fetchHelper.api_url + "core/form/submit/" + id;
      this.forms[id].hasError = false;
      var htmlForm =
        '<form class="dyn-form ' + (form.class ? form.class : "") + '">';
      form.fields.map(field => {
        var m = "_field_" + field.type;
        htmlForm += this[m](field, id);
      });
      htmlForm +=
        '<div class="form-buttons"><button id="formbtn-' +
        id +
        '" type="button" class="btn btn-default"> ' +
        form.submitBtn +
        "</button></div>";
      htmlForm += "</form>";

      var element = document.getElementById("form-" + id);
      if (element) {
        element.innerHTML = htmlForm;
        element.className = element.className.replace(/\bloading\b/g, "");

        var formBtn = $("#formbtn-" + id);

        formBtn
          .unbind()
          .on(
            "click",
            { form: form, htmlForm: element, helper: this, id: id },
            this._submit_form
          );

        var formJ = $(element);

        var files = formJ.find("input[type=file]");
        $.each(files, (i, e) => {
          var el = $(e);
          var name = el.attr("name");
          var field = this._get(name, form);
          el.unbind().on(
            "change",
            { id: id, field: field, name: name, element: el, helper: this },
            this._validate_file
          );
          el.parent()
            .find(".btn")
            .unbind()
            .on("click", () => {
              el.trigger("click");
            });
        });
      }
    });
  },

  _get: function(name, form) {
    var field = null;
    form.fields.map(f => {
      if (f.name === name) field = f;
    });
    return field;
  },

  bytesToSize: function(bytes) {
    if (bytes < 1024) return bytes + " Bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
    else return (bytes / 1073741824).toFixed(2) + " GB";
  },

  _validate_file: function(event) {
    var field = event.data.field;
    var element = event.data.element;
    var helper = event.data.helper;
    var id = event.data.id;
    var maxfiles = parseInt(field.maxfiles);
    var er = element
      .parent()
      .parent()
      .find(".field-error");
    var fs = element
      .parent()
      .parent()
      .find(".field-files");
    er.text("");
    helper.forms[id].hasError = false;
    var files = this.files;
    var maxsize = 1024 * 1024; // !MB

    if (field.maxsize.includes("MB")) {
      maxsize = field.maxsize.replace(/MB/gi, "");
      maxsize = maxsize.replace(/\s/gi, "");
      maxsize = parseInt(maxsize) * 1024;
      maxsize = maxsize * 1024;
    }

    if (field.maxsize.includes("KB")) {
      maxsize = field.maxsize.replace(/KB/gi, "");
      maxsize = maxsize.replace(/\s/gi, "");
      maxsize = parseInt(maxsize) * 1024;
    }

    var regex = null;
    var allowedExtensions = field.allowed_ext;
    if (allowedExtensions) {
      allowedExtensions = allowedExtensions.replace(/\s/gi, "");
      allowedExtensions = allowedExtensions.replace(/\./gi, "\\.");
      allowedExtensions = allowedExtensions.replace(/,/gi, "|");
      allowedExtensions = "(" + allowedExtensions + ")$";
      regex = new RegExp(allowedExtensions, "gi");
    } else {
      if (field.type === "image" || field.type === "images") {
        allowedExtensions = "(.jpg|.jpeg|.png|.gif)$";
        field.allowed_ext = ".jpg,.jpeg,.png,.gif";
      }
      if (field.type === "pdf") {
        allowedExtensions = "(.pdf)$";
        field.allowed_ext = ".pdf";
      }
      if (field.type === "pdf_img") {
        allowedExtensions = "(.jpg|.jpeg|.png|.gif|.pdf)$";
        field.allowed_ext = ".jpg,.jpeg,.png,.gif,.pdf";
      }
      regex = new RegExp(allowedExtensions, "gi");
    }

    helper.forms[id].hasError = false;

    if (!files.length && field.required) {
      element.addClass("error");
      element.val("");
      er.text(field.error_text);
      helper.forms[id].hasError = true;
      return false;
    } else {
      element.removeClass("error");
      er.text("");
    }

    /* VALIDATE NUM */
    if (files.length !== 1 && maxfiles === 1) {
      element.addClass("error");
      element.val("");
      er.text("Maksimalno dozvoljeno fajlova je jedan.");
      helper.forms[id].hasError = true;
      return;
    } else {
      element.removeClass("error");
      er.text("");
    }

    if (helper.forms[id].files === undefined) {
      helper.forms[id].files = {};
    }

    var nxFiles = helper.forms[id].files[field.name];

    if (nxFiles === undefined) {
      helper.forms[id].files[field.name] = {};
      nxFiles = helper.forms[id].files[field.name];
    }

    var tf = files.length;
    tf = tf + Object.keys(nxFiles).length;

    if (tf > maxfiles) {
      element.addClass("error");
      er.text("Maksimalno dozvoljeno fajlova je: " + maxfiles);
      return;
    } else {
      element.removeClass("error");
      er.text("");
    }
    /* VALIDATE NUM END */

    var isValid = true;

    if (this.files.length)
      Object.keys(this.files).map(n => {
        // VALIDATE EXTENSIONS */
        var file = this.files[n];

        if (!file) {
          return;
        }

        if (!file.name.match(regex)) {
          element.addClass("error");
          er.text(
            "Koristite nedozvoljenu extenziju fajla. Dozvoljene ekstenzije su: " +
              field.allowed_ext
          );
          isValid = false;
          helper.forms[id].hasError = true;
          return;
        } else {
          element.removeClass("error");
          er.text("");
        }
        /* VALIDATE EXTENSION END



            /* VALIDATE SIZE */
        if (file.size > maxsize) {
          element.addClass("error");
          er.text(
            "Maksimalna veličina jednog fajla je " +
              helper.bytesToSize(maxsize) +
              ". Fajl " +
              file.name +
              " je veličine " +
              helper.bytesToSize(file.size)
          );
          isValid = false;
          helper.forms[id].hasError = true;
          return;
        } else {
          element.removeClass("error");
          er.text("");
        }
        /* VALIDATE SIZE END */
      });

    if (isValid) {
      element.removeClass("error");
      er.text("");

      fs.html("");
      Object.keys(this.files).map((n, i) => {
        var file = this.files[n];
        if (helper.forms[id].files === undefined) {
          helper.forms[id].files = {};
        }

        if (helper.forms[id].files[field.name] === undefined) {
          helper.forms[id].files[field.name] = {};
        }

        helper.forms[id].files[field.name][file.name] = file;
      });

      Object.keys(helper.forms[id].files[field.name]).map((a, i) => {
        var file = helper.forms[id].files[field.name][a];
        fs.append(
          '<div class="noselect file-item fi-' +
            i +
            '" ><span>' +
            (i + 1) +
            ".</span> <span>" +
            file.name +
            '</span><span class="remove" data-i="' +
            i +
            '" data-a="' +
            a +
            '" data-name="' +
            field.name +
            '"><i class="fa fa-times" ></i></span></div>'
        );
      });

      fs.find(".file-item").each((i, y) => {
        var c = $(y).find(".remove");
        c.unbind().on("click", { helper: helper, id: id }, event => {
          event.stopPropagation();
          event.preventDefault();
          var el = $(event.target);

          if (!el.hasClass("remove")) {
            el = el.parent();
          }

          var i = el.data("i");
          var a = el.data("a");
          var name = el.data("name");
          var id = event.data.id;

          var helper = event.data.helper;

          delete helper.forms[id].files[name][a];
          el.parent().remove();

          if (Object.keys(helper.forms[id].files[name]).length === 0) {
            delete helper.forms[id].files[name];
          }
        });
      });
    }
  },

  fileHtml: function(field, id, _class) {
    if (_class === undefined) {
      if (field.class) {
        _class = field.class;
      }
    }

    var maxfiles = parseInt(field.maxfiles);
    return (
      '<div class="form-group file-group ' +
      (_class ? _class : "") +
      '">' +
      "<label>" +
      field.label +
      ":</label>" +
      '<div class="upload-file">' +
      "<input " +
      (maxfiles != 1 ? "multiple" : "") +
      '  type="file" id="' +
      field.name +
      "-" +
      id +
      '" name="' +
      field.name +
      '" placeholder="' +
      (field.placeholder ? field.placeholder : "") +
      '" data-type="file" >' +
      '<span class="btn">Nađi</span>' +
      "</div>" +
      '<div class="field-info">' +
      (field.description ? field.description : "") +
      "</div>" +
      '<div class="field-error"></div>' +
      '<div class="field-files"></div>' +
      "</div>"
    );
  },

  fileText: function(field, id, _class) {
    if (_class === undefined) {
      if (field.class) {
        _class = field.class;
      }
    }

    return (
      '<div class="form-group ' +
      (_class ? _class : "") +
      '">' +
      "<label>" +
      field.label +
      ":</label>" +
      '<input type="text" maxlength="' +
      (field.maxlength ? field.maxlength : "255") +
      '" id="' +
      field.name +
      "-" +
      id +
      '" name="' +
      field.name +
      '" placeholder="' +
      (field.placeholder ? field.placeholder : "") +
      '" data-type="input" >' +
      '<div class="field-info">' +
      (field.description ? field.description : "") +
      "</div>" +
      '<div class="field-error"></div>' +
      "</div>"
    );
  },

  fileDate: function(field, id, _class) {
    if (_class === undefined) {
      if (field.class) {
        _class = field.class;
      }
    }

    return (
      '<div class="form-group ' +
      (_class ? _class : "") +
      '">' +
      "<label>" +
      field.label +
      ":</label>" +
      '<input type="text" maxlength="' +
      (field.maxlength ? field.maxlength : "255") +
      '" id="' +
      field.name +
      "-" +
      id +
      '" name="' +
      field.name +
      '" placeholder="' +
      (field.placeholder ? field.placeholder : "") +
      '" data-type="input" >' +
      '<div class="field-info">' +
      (field.description ? field.description : "") +
      "</div>" +
      '<div class="field-error"></div>' +
      "</div>"
    );
  },

  fileMessage: function(field, id, _class) {
    if (_class === undefined) {
      if (field.class) {
        _class = field.class;
      }
    }

    return (
      '<div class="form-group ' +
      (_class ? _class : "") +
      '">' +
      "<label>" +
      field.label +
      ":</label>" +
      '<textarea spellcheck="false" maxlength="' +
      (field.maxlength ? field.maxlength : "255") +
      '" id="' +
      field.name +
      "-" +
      id +
      '" name="' +
      field.name +
      '" placeholder="' +
      (field.placeholder ? field.placeholder : "") +
      '" data-type="input" ></textarea>' +
      '<div class="field-info">' +
      (field.description ? field.description : "") +
      "</div>" +
      '<div class="field-error"></div>' +
      "</div>"
    );
  },

  fileHidden: function(field, id, _class) {
    if (!field) return;

    if (_class === undefined) {
      if (field.class) {
        _class = field.class;
      }
    }

    return (
      '<input type="hidden" id="' +
      field.name +
      "-" +
      id +
      '" name="' +
      field.name +
      '" value="' +
      this.parent[field.funct]() +
      '" data-type="input" >'
    );
  },

  _field_hidden: function(field, id) {
    return this.fileHidden(field, id);
  },

  _field_address: function(field, id) {
    return this.fileText(field, id);
  },

  _field_quantity: function(field, id) {
    return this.fileText(field, id);
  },

  _field_name: function(field, id) {
    return this.fileText(field, id);
  },

  _field_stores: function(field, id) {},

  _field_message: function(field, id) {
    return this.fileMessage(field, id);
  },

  _field_date: function(field, id) {},

  _field_price: function(field, id) {
    return this.fileText(field, id);
  },

  _field_pdf: function(field, id) {
    return this.fileHtml(field, id);
  },

  _field_pdf_img: function(field, id) {
    return this.fileHtml(field, id);
  },

  _field_image: function(field, id) {
    return this.fileHtml(field, id);
  },

  _field_images: function(field, id) {
    return this.fileHtml(field, id);
  },

  _field_text: function(field, id) {
    return this.fileText(field, id);
  },

  _field_email: function(field, id) {
    return this.fileText(field, id);
  },

  _field_phone: function(field, id) {
    return this.fileText(field, id);
  },

  _field_date: function(field, id) {
    return this.fileDate(field, id);
  },

  _submit_form(event) {
    var form = event.data.form;
    var formHtml = $(event.data.htmlForm);
    var hasErrors = false;
    var helper = event.data.helper;
    var id = event.data.id;
    var F = helper.forms[id];
    var files = F.files === undefined ? {} : F.files;
    var data = {};

    if (helper.isBusy === true) return false;

    $("body")
      .find(".page-mask")
      .remove();

    form.fields.map(field => {
      var id = field.name + "-" + form.id;
      var e = document.getElementById(id);
      var el = $(e);
      var t = el.data("type");
      var er = el.parent().find(".field-error");
      var value = null;

      switch (t) {
        case "input":
          value = el.val();
          break;
        case "select":
          value = el.find("option:selected").val();
          break;
        default:
          value = el.val();
      }

      data[field.name] = value;

      if (
        field.type == "image" ||
        field.type == "images" ||
        field.type == "pdf" ||
        field.type == "pdf_img"
      ) {
        er = el
          .parent()
          .parent()
          .find(".field-error");
      }

      if (field.pattern) {
        var regex = new RegExp(field.pattern, "gi");
        if (!value.match(regex)) {
          er.text(field.error);
          el.addClass("error");

          hasErrors = true;
          return;
        } else {
        }
      }

      if (
        field.type == "image" ||
        field.type == "images" ||
        field.type == "pdf" ||
        field.type == "pdf_img"
      ) {
        if (helper.forms[form.id].files !== undefined) {
          var files = helper.forms[form.id].files;
          var fileItems = files[field.name];
          if (fileItems) {
            if (Object.keys(fileItems).length === 0) {
              value = "";
            } else {
              value = "1";
            }
          } else {
            value = "";
          }
        } else {
          value = "";
        }
      }

      if (field.required && value.trim() === "") {
        er.text(field.error);
        el.addClass("error");
        hasErrors = true;

        if (
          field.type == "image" ||
          field.type == "images" ||
          field.type == "pdf" ||
          field.type == "pdf_img"
        ) {
          el.parent().addClass("error");
        }

        return;
      } else {
        if (
          field.type == "image" ||
          field.type == "images" ||
          field.type == "pdf" ||
          field.type == "pdf_img"
        ) {
          el.parent().removeClass("error");
        }
      }

      if (field.minlength) {
        if (value.length < parseInt(field.minlength)) {
          er.text(field.min_error);
          el.addClass("error");
          hasErrors = true;
          return;
        }
      }

      if (field.maxlength) {
        if (value.length > parseInt(field.maxlength)) {
          er.text(field.max_error);
          el.addClass("error");
          hasErrors = true;
          return;
        }
      }

      if (field.type === "email") {
        if (
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) !== true
        ) {
          er.text(field.error);
          el.addClass("error");
          hasErrors = true;
          return;
        }
      }

      if (field.type === "phone") {
        var regex = /([\+|\d{3|4}\s])+(?:[\(\d+\)]\s*|\d\s)+\d(?:-|\s*)/g;
        var m = value.match(regex);

        if (m != value) {
          er.text(field.error);
          el.addClass("error");
          hasErrors = true;
          return;
        }
      }

      er.text("");
      el.removeClass("error");
    });

    if (hasErrors) return;
    if (F.hasError) return;

    var url = F.submiturl;

    const formData = new FormData();

    if (Object.keys(files).length) {
      Object.keys(files).map(name => {
        var _files = files[name];
        Object.keys(_files).map((d, g) => {
          var file = _files[d];
          formData.set(name + "[" + g + "]", file);
        });
      });
    }

    if (Object.keys(data).length) {
      Object.keys(data).map(name => {
        var value = data[name];
        formData.append(name, value);
      });
    }

    helper.isBusy = true;
    var busyHtml = $(
      '<div class="page-mask"><div class="page-mask-window"><div class="page-mask-message"><div class="LoaderBalls"><div class="LoaderBalls__item"></div><div class="LoaderBalls__item"></div><div class="LoaderBalls__item"></div></div>Molimo sačekajte...</div></div></div>'
    );
    $("body").append(busyHtml);

    var request = new XMLHttpRequest();

    request.open("POST", url);

    request.onreadystatechange = function(oEvent) {
      if (request.readyState === 4) {
        helper.isBusy = false;
        var json = {};
        if (request.status === 200) {
          json = JSON.parse(request.responseText);
        } else {
          json = {
            status: false,
            message:
              "Izvinjavamo se ali došlo je do nepredviđene greške prilikom slanja poruke."
          };
        }

        setTimeout(() => {
          busyHtml.find(".page-mask-message").text(json.message);

          if (json.status === true) {
            busyHtml.addClass("success");
            $("body")
              .find("#form-" + id)
              .html('<div class="form-response">' + json.message + "</div>");
            setTimeout(() => {
              busyHtml.remove();
            }, 3000);
          } else {
            busyHtml.addClass("error");
            busyHtml
              .find(".page-mask-message")
              .append('<div class="close-window">Zatvori obaveštenje</div>');
            busyHtml
              .find(".close-window")
              .unbind()
              .on("click", function() {
                busyHtml.remove();
              });

            if (json.errors !== undefined) {
              Object.keys(json.errors).map(e => {
                var msg = json.errors[e];
                var x = $("body").find("#form-" + id);
                var i = x.find('[name="' + e + '"]');
                var g = i.closest(".form-group");
                i.addClass("error");
                g.find(".field-error").text(msg);
              });
            }
          }
        }, 2000);
      }
    };

    request.send(formData);
  }
};
