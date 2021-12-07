import { fetchHelper } from "./fetch_helper";
import { CryptHelper } from "./crypt";
import Cookies from "universal-cookie";

import $ from "jquery";

export const StateHelper = {
  debug: true,

  userHash: "G8Iga$tron[-*-]Gtytr",

  subcategory_path: "",

  group_path: "",

  adocean1: null,

  catalog_href: null,

  parent_page: null,

  MENU: {},

  SCROLL_TO_TOP: false,

  AVERAGE_PRODUCTS: {},

  AVERAGE_PRODUCT: {},

  SUBCATEGORY: [],

  PRODUCTS: new Array(),

  PRODUCT: {},

  GRID_PRODUCTS: {},

  PRODUCT_CONTENT: null,

  PRODUCT_STICKERS: null,

  PRODUCT_TECHNOLOGIES: null,

  SUBCATEGORY_IS_LOADING: false,

  SUBCATEGORY_IS_LOADED: false,

  PRODUCT_IS_LODING: false,

  PRODUCT_IS_LOADED: false,

  FILTERS_IS_LOADING: false,

  FILTERS_IS_LOADED: false,

  FILTERS_COUNT_LIST: [],

  BRANDS_COUNT_LIST: [],

  FILTERS: [],

  BRANDS: [],

  PRICES: [],

  ACTIVE_FILTERS: {},

  ACTIVE_BRANDS: {},

  ACTIVE_PRICES: {},

  TOTAL_PRODUCTS: 0,

  TOTAL_PAGES: 1,

  PRODUCT_LIMIT: 24,

  PRODUCT_PAGE: 1,

  PRODUCT_ORDER: "rastuci",

  PRODUCT_DISPLAY: "1/1 od 1",

  PRODUCT_METADATA: {},

  PAGE: 1,

  LIMIT: 24,

  PAGE_VIEW: "grid",

  MERGE_PRODUCST: true,

  QUERY: "",

  LOCATION_SEARCH: "",

  FILTER_CONTROLLER: null,

  ShowAll: false,

  last_product_query: "",

  last_product_subcategory: "",

  USER_ID: null,

  USER: {},

  CART: {
    status: false
  },

  CART_SUBMIT: {},

  PRICE_LIMITER: {},

  is_busy: true,

  last_item: null,

  last_item: null,

  _console: function(msg) {
    if (this.debug == true) {
    }
  },

  products_view: function() {},

  filters_view: function() {},

  brands_view: function() {},

  filters_loader_view: function() {},

  get_url_segment: function(key) {
    var url_string = global.window.location.href;
    var url = new URL(url_string);
    var c = url.searchParams.get(key);
    return c != undefined ? c : null;
  },

  last_query_url: null,

  shortUrl: function() {
    var an = fetchHelper.URLToArray(global.window.location.search);
    if (an["strana"] != undefined) delete an["strana"];
    if (an["prikaz"] != undefined) delete an["prikaz"];
    if (an["poredak"] != undefined) delete an["poredak"];
    if (an["limit"] != undefined) delete an["limit"];

    var de = fetchHelper.ArrayToURL(an);
    if(de) de = '?'+de;
    var x = global.window.location.pathname + de;
    x = x.replace(/\?\?/, "?");
    return x;
  },

  get_url_params: function(){
    var params = fetchHelper.URLToArray(global.window.location.search);
    Object.keys(params).map((a,b)=>{
      var p = params[a].split('+');
      params[a] = p;
      if(a === 'cena'){
        params[a] = [];
        params[a].push(p[p.length-1]);
      }
    });
    return params;
  },

  get_url_path: function(){
    return global.window.location.pathname;
  },

  params_to_query(params){
    var prs = [];
    Object.keys(params).map((param, indx) => {
      if(params[param].length){
        if(param === 'cena'){
          prs.push(param+'='+(params[param][params[param].length-1]));
        } else 
        prs.push(param+'='+(params[param].join('+')));
      }
    });
    var query = prs.join('&');
    return query;
 },

  params_to_url(params){
     var query = StateHelper.params_to_query(params);
     return  global.window.location.pathname + (query.length ? ('?'+query) : '');
  },

  get_url: function(){
    return  global.window.location.pathname +  global.window.location.search;
  },

  get_query: function(){
    return  global.window.location.search;
  },

  isUrlChanged: function() {},

  SCROLLTOP: function() {
    setTimeout(() => {
      global.window.scroll({ top: 0, left: 0, behavior: "smooth" });
    }, 250);
  },

  FETCH_CATEGORY: function(path, callback) {
    fetchHelper.fetchCategory(path, e => {
      this.CATEGORY = e.category;
      callback(e);
    });
  },

  FETCH_SUBCATEGORY: function(callback) {
    this._console("FETCH_SUBCATEGORY START");

    this.QUERY = fetchHelper.query(this.LOCATION_SEARCH, 1);

    var path = global.window.location.pathname.substr(1);

    fetchHelper.fetchSubcategory(path, r => {
      this.SUBCATEGORY_IS_LOADED = true;
      this.SUBCATEGORY_IS_LOADING = false;
      this.SUBCATEGORY = r;
      this._console("FETCH_SUBCATEGORY END");
      if (this.SUBCATEGORY)
        if (this.SUBCATEGORY.id !== this.last_product_subcategory) {
          this.MERGE_PRODUCST = false;
        }
      if (this.SUBCATEGORY) this.last_product_subcategory = this.SUBCATEGORY.id;
      callback();
    });
  },

  FETCH_COUNTS: function(callback) {
    this.FILTERS_IS_LOADED = false;
    this.FILTERS_IS_LOADING = true;

    this.parent_page.forceLoadFilters();

    this._console("FETCH_COUNTS_START");

    if (this.SUBCATEGORY) {
      fetchHelper.fetchFiltersCount(
        this.LOCATION_SEARCH,
        this.SUBCATEGORY.id,
        this,
        (specifications, brands, response) => {
          this._console("FETCH_COUNTS_END");

          this.FILTERS = specifications;
          this.BRANDS = brands;
          this.PRICES = response.prices;
          this.ACTIVE_FILTERS = response.active_filters;
          this.ACTIVE_BRANDS = response.active_brands;
          this.ACTIVE_PRICES = response.active_prices;

          this.FILTERS_IS_LOADED = true;
          this.FILTERS_IS_LOADING = false;

          callback();
        }
      );
    } else {
      this.FILTERS_IS_LOADING = true;
    }
  },

  FETCH_FILTERS: function(path, group, callback) {
    if (this.FILTERS_IS_LOADING == true) return;

    this.subcategory_path = path;
    this.group_path = group;
    this.path = path;
    this._console("FETCH_FILTERS START");

    this.FILTERS_IS_LOADING = true;
    this.FILTERS_IS_LOADED = false;

    if (this.SUBCATEGORY)
      fetchHelper.fetchSpecifications(
        this.SUBCATEGORY.id,
        this.LOCATION_SEARCH,
        response => {
          this._console("FETCH_FILTERS END");

          this.FILTERS = response;

          this.FILTERS_IS_LOADING = true;

          callback();
        }
      );
  },

  filter_query: function(q) {
    var str = q != undefined ? q : this.LOCATION_SEARCH;
    var a = fetchHelper.URLToArray(str);

    if (a["strana"] != undefined) {
      delete a["strana"];
    }
    return fetchHelper.ArrayToURL(a);
  },

  is_changed: function(search) {
    var q1 = this.filter_query(search);
    var q2 = this.filter_query(StateHelper.LOCATION_SEARCH);

    return q1 == q2;
  },

  merge_products: function(list) {
    list.map(item => {
      this.PRODUCTS.push(item);
    });
  },

  FETCH_PRODUCTS: function(callback) {
    if (this.SUBCATEGORY) {
      this.PRODUCT_IS_LODING = true;
      this.PRODUCT_IS_LOADED = false;

      this._console("PRODUCTS IS LOADING");

      var path =
        global.window.location.pathname.substr(1) +
        "?" +
        global.window.location.search;

      fetchHelper.fetchGridProducts(path, response => {
        if (this.MERGE_PRODUCST == false) {
          this.PRODUCTS = response.items;
        } else {
          //this.PRODUCTS = {...this.PRODUCTS, ...response.items};
          this.merge_products(response.items);
        }

        this.TOTAL_PRODUCTS = response.total_pages;
        this.PRODUCT_LIMIT = response.limit;
        this.PRODUCT_PAGE = response.page;
        this.PRODUCT_DISPLAY = response.display;

        this._console("PRODUCTS IS LOADED");

        callback();

        if (this.SCROLL_TO_TOP) {
          this.SCROLLTOP();
        }

        this.is_busy = false;
        this.SCROLL_TO_TOP = false;

        //fetchHelper.app.setState({isBusy:false});
      });
    }
  },

  removeClass: function(element, name) {
    element.classList.remove(name);
    element.className = element.className.replace(/\s\s+/g, " ");
  },

  addClass: function(element, name) {
    element.classList.add(name);
    element.className = element.className.replace(/\s\s+/g, " ");
  },

  cleanString(str) {
    var div = document.createElement("div");
    div.innerHTML = str;
    return div.textContent || div.innerText || "";
  },

  reduceString(str) {
    return str.replace(/[^a-zA-Z0-9]/g, "");
  },

  FETCH_PRODUCT: function(product_id, callback) {
    this._console("SINGLE PRODUCT LOADING");

    fetchHelper.fetchProduct(product_id, response => {
      this._console("SINGLE PRODUCT IS LOADED");
      this.PRODUCT = response.items;
      callback();
    });
  },

  FETCH_PRODUCT_TECHNOLOGIES: function(product_id, callback) {
    this._console("PRODUCT TECHNOLOGIES LOADING");

    fetchHelper.fetchProductTechnologies(product_id, response => {
      this._console("PRODUCT TECHNOLOGIES IS LOADED");
      this.PRODUCT_TECHNOLOGIES =
        response.status === true ? response.items : null;
      callback();
    });
  },

  FETCH_PRODUCT_BUNDLES: function(product_id, callback) {
    this._console("PRODUCT BUNDLES LOADING");

    fetchHelper.fetchProductBundles(product_id, response => {
      this._console("PRODUCT BUNDLES IS LOADED");
      this.PRODUCT_BUNDLES = response.status === true ? response.items : null;
      callback();
    });
  },

  FETCH_PRODUCT_CONTENT: function(product_id, callback) {
    this._console("PRODUCT CONTENT LOADING");

    fetchHelper.fetchProductContent(product_id, response => {
      this._console("PRODUCT CONTENT IS LOADED");
      this.PRODUCT_CONTENT = response.status === true ? response.content : null;
      callback(this.PRODUCT_CONTENT);
    });
  },

  FETCH_PRODUCT_STICKERS: function(product_id, callback) {
    this._console("PRODUCT STICKERS LOADING");

    fetchHelper.fetchProductStickers(product_id, response => {
      this._console("PRODUCT STICKERS IS LOADED");
      this.PRODUCT_STICKERS = response;
      callback(response);
    });
  },

  /* CART */
  /* ------------------------------------------------------------------ */

  CART_ITEMS: function(callback) {
    this._console("FETCH CART ITEMS LOADING");
    fetchHelper.fetch_cart_items(e => {
      this.CART = e;
      callback(e);
      this._update_plugins(e);
      this._update_finalcart(e);
      this._console("FETCH CART ITEMS LOADED");
    });
  },

  ADD_TO_CART: function(id, quantity, callback) {
    var str = "id=" + id + "&quantity=" + quantity;
    var c = CryptHelper.encrypt(str);
    fetchHelper.setAddToCart(c, r => {
      fetchHelper.app.setState({ cart: r });
      callback(r);
    });
  },

  ADD_BUNDLE_SINGLE_TO_CART: function(post, qty, callback) {
    fetchHelper.setAddToCartBundleSingleItem(post, qty, callback);
  },

  ADD_BUNDLE_GROUP_TO_CART: function(post, qty, callback) {
    fetchHelper.setAddToCartBundleGroupItem(post, qty, callback);
  },

  REMOVE_FROM_CART: function(id, callback) {
    fetchHelper.setRemoveFromCart(id, callback);
  },

  VALIDATE_PROMOCODE: function(code, callback) {
    fetchHelper.validate_promocode(code, e => {
      this.CART_ITEMS(e => {
        fetchHelper.app.setState({ cart: e });
        fetchHelper.header.update();
        this._update_plugins(e);
      });

      callback(e);
    });
  },

  REFRESH_CART: function() {
    this.CART_ITEMS(e => {
      fetchHelper.app.setState({ cart: e });
      fetchHelper.header.update();

      this._update_plugins(e);
    });
  },

  _update_plugins: function(e) {
    if (e.plugins != undefined) {
      $.each(e.plugins, function(i, e) {
        e.map(a => {
          var target = $("body").find(a.el);
          if (target.is("input")) {
            $("body")
              .find(a.el)
              .val(a.val);
          } else {
            $("body")
              .find(a.el)
              .html(a.val);
          }
        });
      });
    }
  },

  _update_finalcart: function(e) {},

  SET_CART_SUBMIT: function(callback) {
    if (this.CART_SUBMIT.shipping == undefined) {
      callback({
        status: false,
        message: "Morate izabrati način isporuke.",
        id: "shipping"
      });
      return false;
    }

    if (this.CART_SUBMIT.payment == undefined) {
      callback({
        status: false,
        message: "Morate izabrati način plaćanja.",
        id: "payment"
      });
      return false;
    }

    fetchHelper.submitCart(this.CART_SUBMIT, e => {
      callback(e);
    });
  },

  REGISTER_USER: function(post, callback) {
    fetchHelper.fetchRegisterUser(post, response => {
      callback(response);
    });
  },

  LOGIN_USER: function(email, pwd, callback) {
    fetchHelper.login_user(email, pwd, response => {
      callback(response);
    });
  },

  LOGIN_SOCIAL: function(credential, callback) {
    fetchHelper.login_social(credential, response => {
      callback(response);
    });
  },

  FORGOTH_REQUEST: function(email, callback) {
    fetchHelper.forgoth_request(email, response => {
      callback(response);
    });
  },

  FORGOTH_REQUEST_SUMBIT: function(pwd, token, callback) {
    fetchHelper.forgoth_request_sumbit(pwd, token, response => {
      callback(response);
    });
  },

  FORGOTH_REQUEST_DATE: function(token, callback) {
    fetchHelper.forgoth_request_date(token, response => {
      callback(response);
    });
  },
  CONTACT_SUMBIT: function(data, callback) {
    fetchHelper.contact_sumbit(data, response => {
      callback(response);
    });
  },
  STORE_USER_ID: function(user_id) {
    this.USER_ID = user_id;
  },

  ISLOGED: function(callback) {
    return fetchHelper.app.state.user.status;
  },

  FETCH_IS_LOGED: function(callback) {
    if (this.USER_ID) {
      callback(true);
    } else {
      fetchHelper.is_loged(response => {
        if (response.status == true) {
          var u = {
            status: true,
            user: response.user
          };
          fetchHelper.app.setState({ user: u });
          this.STORE_USER_ID(u.user.id);
          this.USER = u.user;
          callback(true);
        } else {
          callback(false);
        }
      });
    }
  },

  LOGOUT: function() {
    fetchHelper.logout(e => {
      this.USER = {};
      this.USER_ID = null;
      var user = {
        status: false,
        user: null
      };
      fetchHelper.app.setState({ user: user });
    });
  },

  USER_PROFILE: function(callback) {
    fetchHelper.user_profile(callback);
  },

  UPDATE_USER: function(user, callback) {
    fetchHelper.update_user(user, callback);
  },

  FETCH_AVERAGE_PRODUCTS: function(sub_id, callback) {
    if (this.AVERAGE_PRODUCTS[sub_id] != undefined)
      callback(this.AVERAGE_PRODUCTS[sub_id]);

    fetchHelper.fetch_averages_products(sub_id, r => {
      this.AVERAGE_PRODUCTS[sub_id] = r;
      callback(r);
    });
  },

  FETCH_AVERAGE_PRODUCT: function(sub_id, product_id, callback) {
    if (this.AVERAGE_PRODUCT[product_id] != undefined)
      callback(this.AVERAGE_PRODUCT[product_id]);

    fetchHelper.fetch_averages_product(sub_id, product_id, r => {
      this.AVERAGE_PRODUCT[product_id] = r;
      callback(r);
    });
  },

  FETCH_PRICE_LIMITER: function(callback) {
    fetchHelper.fetch_price_limiter_widget(r => {
      this.PRICE_LIMITER = r;
      callback(r);
    });
  },

  FETCH_MENU: function(id, callback) {
    fetchHelper.fetch_menu(id, r => {
      this.MENU[id] = r;
      callback(r);
    });
  },

  FETCH_NEWS_LIST: function(type, page, callback) {
    fetchHelper.fetch_news_list(type, page, callback);
  },

  FETCH_NEWS: function(id, callback) {
    fetchHelper.fetch_news(id, callback);
  },

  FETCH_PREORDERS: function(page, callback) {
    fetchHelper.fetchPreorders(page, callback);
  },

  FETCH_PREORDER: function(slug, callback) {
    fetchHelper.fetchPreorder(slug, callback);
  },

  SUBMIT_PREORDER: function(post, callback) {
    fetchHelper.submitPreorder(post, callback);
  },

  FETCH_ARTICLE_LIST: function(slug, category, page, callback) {
    fetchHelper.fetch_article_list(slug, category, page, callback);
  },

  FETCH_ARTICLE: function(id, callback) {
    fetchHelper.fetch_article(id, callback);
  },

  LOAD_DEALS: function(callback) {
    fetchHelper.fetch_deal(callback);
  }
};
