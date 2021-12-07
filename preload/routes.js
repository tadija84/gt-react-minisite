const routes = [
  {
    url: "/akcije",
    api: "core/news/meta/akcije",
    params: {},
    priority: 99
  },
  {
    url: "/akcije/([.A-Za-z0-9_-]+)-(\\d+)",
    api: "core/news/meta/",
    params: {},
    priority: 100
  },
  {
    url: "/([.A-Za-z0-9_-]+)/([.A-Za-z0-9_-]+)-(\\d+)",
    api: "core/product/meta/",
    params: {},
    priority: 21
  },
  {
    url: "/([.A-Za-z0-9_-]+)/([.A-Za-z0-9_-]+)/([.A-Za-z0-9_-]+)",
    api: "core/subcategory/meta/",
    params: { type: "subcategory" },
    priority: 20
  },
  {
    url: "/([.A-Za-z0-9_-]+)/([.A-Za-z0-9_-]+)",
    api: "core/subcategory/meta/",
    params: { type: "group" },
    priority: 19
  },
  {
    url: "/([.A-Za-z0-9_-]+)",
    api: "core/category/meta/",
    params: { type: "category" },
    priority: 18
  },
  {
    url: "/",
    api: "core/home/meta/",
    params: {},
    priority: 1
  }
];

export default routes;
