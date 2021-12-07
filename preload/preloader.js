import fetch from "./fetch";

import routes from "./routes";
import { pairs } from "rxjs";

export default function Preloader(req, res) {
  const url = req.url;

  var match = null;

  routes.sort(function(a, b) {
    return parseInt(b.priority) - parseInt(a.priority);
  });

  console.log(routes);

  routes.map(route => {
    var Rgx = new RegExp(route.url, "g");
    var n = url.match(Rgx);

    if (n) {
      if (!match) {
        match = route;
        console.log("Match");
        console.log(route);
      }
    }
  });

  if (!match) {
    res.status(404).send("page not found");
    return;
  }

  var api_url = `${match.api}${url}`;
  api_url = api_url.replace("//", "/");

  console.log(api_url);

  var plus = encodeURIComponent(JSON.stringify(match.params));

  return fetch.api(api_url, req.url);
}
