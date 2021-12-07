function slugify(str) {
  if (str == undefined) return "";

  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  var spr = "-";

  var from = [
    "č",
    "ć",
    "ž",
    "š",
    "đ",
    "à",
    "á",
    "ä",
    "â",
    "è",
    "é",
    "ë",
    "ê",
    "ì",
    "í",
    "î",
    "ò",
    "ó",
    "ö",
    "ô",
    "ù",
    "ú",
    "ü",
    "û",
    "ç",
    "\\/",
    "\\:",
    "\\;",
    "'",
    "\\[",
    "\\]",
    "\\(",
    "\\)",
    '"',
    "\\*",
    "\\+",
    "\\>",
    "\\<",
    "\\?",
    "@",
    "\\!",
    "\\#",
    "\\%",
    "\\$"
  ];

  var to = [
    "c",
    "c",
    "z",
    "s",
    "js",
    "a",
    "a",
    "a",
    "a",
    "e",
    "e",
    "e",
    "e",
    "i",
    "i",
    "i",
    "o",
    "o",
    "o",
    "o",
    "u",
    "u",
    "u",
    "u",
    "c",
    "",
    spr,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    spr,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ];

  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from[i], "g"), to[i]);
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, spr) // collapse whitespace and replace by -
    .replace(/-+/g, spr)
    .replace(/_+/g, spr); // collapse dashes

  return str;
}

function replaceQueryItem(query_string, name, value) {
  var str = "";
  var _list = [];
  var _list2 = [];
  var x = query_string.split("?");
  if (x.length === 2) {
    str = x[1];
    _list = str.split("&");
  }

  _list.map(item => {
    var i = item.split("=");
    if (i.length === 2) {
      var k = i[0];
      if (k !== name) {
        _list2.push(k + "=" + i[1]);
      }
    }
  });

  _list2.push(name + "=" + value);

  str = "?" + _list2.join("&");

  return str;
}

var hashListenerChange = "";
var hashListenerInterval = null;

function hashChangeListener(callback){
    clearInterval(hashListenerInterval);
    hashListenerInterval = setInterval(()=>{
        if(hashListenerChange !== global.window.location.hash){
            hashListenerChange = global.window.location.hash;
            callback(global.window.location.hash);
        }
    },300);
}


function unbindHashChangeListener(){
    clearInterval(hashListenerInterval);
}


export { slugify, replaceQueryItem, hashChangeListener, unbindHashChangeListener };
