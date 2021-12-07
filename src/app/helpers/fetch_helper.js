import React, { Component , useState, useEffect } from "react";
import { CryptHelper } from "./crypt";
import { StateHelper } from "./state_helper";
import FormData from "form-data";
import fetch from "isomorphic-fetch";
import constants from "./constants";


export const fetchHelper = {
  environment: "development",
  token: "GiGaToKen88AcnnNy",
  resource_url: constants.resource(),
  api_catalog: constants.api(),
  api_url: constants.api(),

  app: null,

  header: null,


  URLToArray: function(url) {
    var request = {};
    var pairs = url.substring(url.indexOf("?") + 1).split("&");
    for (var i = 0; i < pairs.length; i++) {
      if (!pairs[i]) continue;
      var pair = pairs[i].split("=");
      request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return request;
  },

  ArrayToURL: function(array) {
    var pairs = [];
    for (var key in array)
      if (array.hasOwnProperty(key))
        pairs.push(
          encodeURIComponent(key) + "=" + encodeURIComponent(array[key])
        );
    return pairs.join("&");
  },

  query: function(search, page, remove_page) {
    if (page == undefined) page = 1;

    var queryArray = this.URLToArray(search);

    if (page !== undefined) {
      queryArray["strana"] = page;
    }

    queryArray["limit"] = StateHelper.LIMIT;
    queryArray["prikaz"] = StateHelper.PAGE_VIEW;
    queryArray["poredak"] = StateHelper.PRODUCT_ORDER;

    if (remove_page == true) {
      delete queryArray["strana"];
    }

    var uri = this.ArrayToURL(queryArray);
    uri = uri.replace("%E2", "");
    uri = uri.replace("%80", "");
    uri = uri.replace("%8B", "");
    uri = uri.replace("%2B", "+");

    uri = uri.replace("%2B", "+");
    uri = uri.replace(/%2B/g, "+");
    uri = uri.replace(/%8B/g, "");
    uri = uri.replace(/%80/g, "");
    uri = uri.replace(/%E2/g, "");

    uri = "?" + uri;
    uri = uri.replace("??", "?");

    return uri;
  },

  last_fetch: null,

  uid: null,

  cart_session: function() {
    try {
      if (localStorage !== undefined) {
        var uid = localStorage.getItem("UID3");

        if (uid !== undefined && uid !== null) {
          this.uid = uid;
        } else {
          this.uid =
            "_" +
            Math.random()
              .toString(36)
              .substr(2, 9);

          localStorage.setItem("UID3", this.uid);
        }

        return this.uid;
      }
    } catch (e) {}
  },

  fetch: function(server_path, post_data, callback ) {

    var call_url = this.api_url + server_path;
    call_url = call_url.replace("??", "?");
    call_url = call_url.replace("%2B", "+");
    call_url = call_url.replace(/%2B/g, "+");

    let formData = new FormData();
    formData.append("vs_auth", this.generate_token());

    if (post_data != undefined && post_data != null) {
      Object.keys(post_data).map(function(a, e) {
        formData.append(a, post_data[a]);
      });
    }

    if (this.last_fetch != call_url) {
      if (call_url.includes("?")) {
        call_url += "&uid=" + this.cart_session();
      } else {
        call_url += "?uid=" + this.cart_session();
      }

      this.last_fetch = call_url;

      return fetch(call_url, {
        credentials: "include",
        method: "POST",
        body: formData
      })
        .then(response => response.json())
        .then(json => {
          if (callback) {
            callback(json);
          }

          return json;
        }).catch(err => {
            console.log("err", err.name);
            if (err.name === "AbortError") return;
            // throw error;
          });
    }
  },

  fetch_routes: function(callback) {
    var url = "/core/routes";
    return this.fetch(url, null, callback);
  },
  generate_token() {
    var milliseconds = new Date().getTime();
    var unix = Math.round(+new Date() / 1000);
    return CryptHelper.encrypt("hash=" + unix);
  },

  fetch_cart_items: function(callback) {
    this.fetch("core/cart/items", {}, callback);
  },

  // proveriti da li se ovo jos koristi
  fetchCatalog: function(server_path, post_data, callback) {
    var call_url = this.api_catalog + server_path;
    call_url = call_url.replace("??", "?");
    let formData = new FormData();

    if (post_data != undefined && post_data != null) {
      Object.keys(post_data).map(function(a, e) {
        formData.append(a, post_data[a]);
      });
    }

    return fetch(call_url, { method: "POST", body: formData })
      .then(response => response.json())
      .then(json => {
        callback(json);
      });
  },

  fetchCategory: function(slug, callback) {
    var url = "core/category/get/" + slug;

    this.fetch(url, null, callback);
  },

  fetchSubcategory: function(slug, callback) {
    var url = "core/subcategory/get/" + slug;

    this.fetch(url, null, callback);
  },

  fetchBrands: function(sub_id, query, callback) {
    if (query) {
      query = "?" + query;
      query = query.replace("??", "?");
    }

    var url = "core/brands/index/" + sub_id + query;
    this.fetch(url, null, callback);
  },

  fetchSpecifications: function(sub_id, query, callback) {
    var url = "core/specifications/get/" + sub_id + "?" + query;
    url = url.replace("??", "?");

    this.fetch(url, null, e => {
      if (e)
        if(e.asortiman === undefined)
        Object.keys(e).map(a => {
          var spec = e[a];
          var filters = spec.filters;

          Object.keys(filters).map(x => {
            var filter = filters[x];
            e[a].filters[x].count = 0;
          });

          var c = Object.keys(filters).length;

          if (c > 4) {
            e[a].show = 4;
            e[a].hasBtn = true;
          } else {
            e[a].show = c;
            e[a].hasBtn = false;
          }
        });

      callback(e);
    });
  },

  fetchGridProducts: function(query, callback) {
    var url = "core/product/grid/" + query;
    

    this.fetch(url, {}, callback);
  },

  fetchFiltersCount: function(sub_id, search, callback) {
    var url = "core/specifications/count/" + sub_id + search;
    this.fetch(url, null, resp => {
      callback(resp);
    });
  },

  fetchBrandCounts: function(sub_id, search, callback){
    this.fetchBrands(sub_id, search, r => {
      callback(r);
    });
  },

  product_images: function(product_id, callback) {
    var url = "core/product/images/" + product_id;
    this.fetch(url, null, callback);
  },

  price_format(price) {
    var min_price = price["min_price"];
    var max_price = price["max_price"];

    var obj = {
      slug: "",
      text: ""
    };

    if (min_price == "0") {
      obj.slug = "do_" + max_price;
      obj.text = "Do " + max_price;
    } else {
      if (min_price != "0" && max_price != "0") {
        obj.slug = "od_" + min_price + "_do_" + max_price;
        obj.text = "Od " + min_price + " do " + max_price;
      }
    }

    if (max_price == "0" && min_price != "0") {
      obj.slug = "preko_" + min_price;
      obj.text = "Preko " + min_price;
    }

    return obj;
  },

  fetchProduct(id, callback) {
    var url = "core/product/index/" + id;
    this.fetch(url, null, callback);
  },

  fetchProductTechnologies(id, callback) {
    var url = "core/product/technologies/" + id;
    this.fetch(url, null, callback);
  },

  fetchProductBundles(id, callback) {
    var url = "core/product/bundles/" + id;
    this.fetch(url, null, callback);
  }, 

  fetchProductContent(id, callback) {
    var url = "core/product/content/" + id;
    this.fetch(url, null, callback);
  },

  fetchProductStickers(id, callback) {
    var url = "core/product/stickers/" + id;
    this.fetch(url, null, callback);
  },

  setAddToCart(hash, callback) {
    var url = "core/cart/add_product/" + hash;
    this.fetch(url, null, callback);
  },

  setAddToCartBundleSingleItem(post, qty, callback) {
    var url = "core/cart/add_bundle_item/" + qty;
    this.fetch(url, post, callback);
  },

  setAddToCartBundleGroupItem(post, qty, callback) {
    var url = "core/cart/add_bundle_group_item/" + qty;
    this.fetch(url, post, callback);
  },

  setRemoveFromCart(id, callback) {
    var url = "core/cart/remove_product/" + id;
    this.fetch(url, null, callback);
  },

  fetchPaymentOptions(callback) {
    var url = "core/cart/payment_options";
    this.fetch(url, {}, callback);
  },

  fetchDeliveryOptions(callback) {
    var url = "core/cart/delivery_options";
    this.fetch(url, {}, callback);
  },

  setPromocode(code, callback) {
    var url = "core/cart/promocode/" + code;
    this.fetch(url, {}, callback);
  },

  submitCart(post, callback) {
    var url = "core/cart/submit";
    this.fetch(url, post, callback);
  },

  fetchCartPlugins(callback) {
    var url = "core/cart/plugins";
    this.fetch(url, {}, callback);
  },

  fetchRegisterUser(post, callback) {
    var url = "core/user/register";
    this.fetch(url, post, callback);
  },

  is_loged(callback) {
    var url = "core/user/is_loged";
    this.fetch(url, {}, callback);
  },

  login_user(email, pwd, callback) {
    var url = "core/user/login";
    var post = {
      email: email,
      pwd: pwd
    };
    this.fetch(url, post, callback);
  },

  login_social(credential, callback) {
    var url = "core/user/social_login";
    this.fetch(url, credential, callback);
  },

  forgoth_request(email, callback) {
    var url = "core/user/forgoth_request";
    this.fetch(url, { email: email }, callback);
  },

  forgoth_request_sumbit(pwd, token, callback) {
    var url = "core/user/forgoth_request_sumbit";
    this.fetch(url, { password: pwd, token: token }, callback);
  },

  forgoth_request_date(token, callback) {
    var url = "core/user/get_forgoth_request_date";
    this.fetch(url, { token: token }, callback);
  },

  contact_sumbit(data, callback) {
    var url = "core/contact/sumbit";
    this.fetch(url, { data: data }, callback);
  },

  logout: function(callback) {
    var url = "core/user/logout";
    this.fetch(url, {}, callback);
  },

  verify_email(post, callback) {
    var url = "core/user/verify_email";
    this.fetch(url, post, callback);
  },

  is_verified_email(id, callback) {
    var url = "core/user/is_verified_email/" + id;
    this.fetch(url, {}, callback);
  },

  send_verification_phone(id, phone, callback) {
    var url = "core/user/send_code";
    this.fetch(url, { id: id, phone: phone }, callback);
  },

  send_verification_by_phone(phone, callback) {
    var url = "core/user/send_verification_code";
    this.fetch(url, { phone: phone }, callback);
  },

  verify_sms_code(code, phone, callback) {
    var url = "core/user/verify_phone";
    this.fetch(url, { code: code, phone: phone }, callback);
  },

  validate_promocode(code, callback) {
    var url = "core/cart/promocode/" + code;
    this.fetch(url, null, callback);
  },

  pluginOnChange(post, callback) {
    var url = "core/plugin/change";
    this.fetch(url, post, callback);
  },

  fetch_main_nav(callback) {
    var url = "core/navigation/get";
    this.fetch(url, null, callback);
  },

  fetch_components(indx, callback) {
    var url = "core/components/get/" + indx;
    this.fetch(url, null, callback);
  },
  fetch_gaming_components(callback) {
    var url = "core/components/gaming";
    this.fetch(url, null, callback);
  },
  fetch_gaming_articles(callback) {
    var url = "core/articles/gaming";
    this.fetch(url, null, callback);
  },
  user_profile(callback) {
    var url = "/core/user/user_profile";
    this.fetch(url, null, callback);
  },
  update_user(user, callback) {
    var url = "/core/user/update_profile";
    this.fetch(url, user, callback);
  },
  fetch_brand_widgets(callback) {
    var url = "/core/brands/widget";
    this.fetch(url, null, callback);
  },
  fetch_averages_products(sub_id, callback) {
    var url = "core/product/average_products/" + sub_id;
    this.fetch(url, null, callback);
  },
  fetch_averages_product(sub_id, product_id, callback) {
    var url = "core/product/average_products/" + sub_id + "/" + product_id;
    this.fetch(url, null, callback);
  },
  fetch_price_limiter_widget(callback) {
    var url = "core/pricemeter/widget";
    this.fetch(url, null, callback);
  },
  fetch_menu(id, callback) {
    var url = "core/navigation/menu/" + id;
    this.fetch(url, null, callback);
  },
  fetch_order_final(cartid, callback) {
    var url = "core/cart/view_order/" + cartid;
    this.fetch(url, null, callback);
  },
  fetch_news_list: function(type, page, callback) {
    var url = "core/news/get/" + +type + "/" + page;
    this.fetch(url, null, callback);
  },
  fetch_news: function(id, callback) {
    var url = "core/news/details/" + id;
    this.fetch(url, null, callback);
  },
  fetch_slideshow: function(category_id, gaming, callback) {
    var url = "core/slideshow/get/" + category_id;
    if (gaming) {
      url += "/" + gaming;
    }
    this.fetch(url, null, callback);
  },
  fetch_maps: function(callback) {
    var url = "core/maps/geojson";
    this.fetch(url, null, callback);
  },
  fetch_menucomponents: function(app_type, callback) {
    var url = "core/menu_components/get/" + app_type;
    this.fetch(url, null, callback);
  },
  fetchAppleData: function(callback) {
    var url = "core/apple";
    this.fetch(url, null, callback);
  },

  fetch_page: function(id, section, callback) {
    if (section == null) section = 1;
    var url = "core/page/get/" + section + "/" + id;
    this.fetch(url, null, callback);
  },

  fetch_jobs: function(callback) {
    var url = "core/jobs/listing";
    this.fetch(url, null, callback);
  },

  fetch_job: function(id, callback) {
    var url = "core/jobs/item/" + id;
    this.fetch(url, null, callback);
  },
  fetch_order_history(page, callback) {
    var url = "cart_history/" + page;
    this.fetch(url, null, callback);
  },
  fetch_order(id, type, callback) {
    var url = "cart_history/order/" + id + "/" + type;
    this.fetch(url, null, callback);
  },
  fetchReviewSpecifications(sub_id, callback) {
    var url = "core/review/get/" + sub_id;
    return this.fetch(url, null, callback);
  },
  setReview(post, callback) {
    var url = "core/review/set";
    return this.fetch(url, post, callback);
  },
  fetchFavorites(callback) {
    var url = "core/favorite/get";
    return this.fetch(url, null, callback);
  },
  setFavorite(id, callback) {
    var url = "core/favorite/set/" + id;
    return this.fetch(url, null, callback);
  },
  fetchFavoriteProducts(callback) {
    var url = "core/favorite/products";
    return this.fetch(url, null, callback);
  },
  fetchHistoryProducts(callback) {
    var url = "core/history/get";
    return this.fetch(url, null, callback);
  },
  newsletter(status, callback) {
    var url = "core/newsletter/change/" + status;
    return this.fetch(url, null, callback);
  },
  newsletterAdd(data, callback) {
    var url = "core/newsletter/add";
    return this.fetch(url, { data: data }, callback);
  },
  newsletterRemove(data, callback) {
    var url = "core/newsletter/remove";
    return this.fetch(url, { data: data }, callback);
  },
  fetchPromotionPage(id, callback) {
    var url = "core/promotions/page/" + id;
    return this.fetch(url, null, callback);
  },
  fetchPreorders(page, callback) {
    var url = "core/preorders/listing/" + page;
    return this.fetch(url, null, callback);
  },
  fetchPreorder(slug, callback) {
    var url = "core/preorders/details/" + slug;
    return this.fetch(url, null, callback);
  },
  submitPreorder(post, callback) {
    var url = "core/preorders/submit";
    return this.fetch(url, post, callback);
  },
  fetch_article_list(slug, category, page, callback) {
    var url = "core/articles/get/" + slug + "/" + category + "/" + page;
    return this.fetch(url, null, callback);
  },
  fetch_article(id, callback) {
    var url = "core/articles/details/" + id;
    return this.fetch(url, null, callback);
  },
  fetch_deal(callback) {
    var url = "core/deal/items";
    return this.fetch(url, null, callback);
  },

  fetchOutlet(request, callback) {
    request = request.replace("outlet/", "");
    var url = "core/outlet/items" + request;
    return this.fetch(url, null, callback);
  },
  fetchPaperCatalog(callback) {
    var url = "core/catalog/get";
    return this.fetch(url, null, callback);
  },
  fetchCategoryAll(callback) {
    var url = "core/category/all";
    return this.fetch(url, null, callback);
  },

};
