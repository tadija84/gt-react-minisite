import request from "axios";
import constants from "./constants";
import { stringify } from "postcss";

const fetch = {
  api: function(path, query, callbalck) {
    var domain =
      constants.environment === "production"
        ? constants.apiUrl
        : constants.devapiUrl;

    var url = `${domain}${path}`;

    if (!url.includes("?")) {
      url += "?a=b";
    }

    if (query) {
      if (query.includes("?")) {
        var a = query.split("?");
        url += "&" + a[1];
      }
    }

    return request.get(url);
  }
};

export default fetch;
