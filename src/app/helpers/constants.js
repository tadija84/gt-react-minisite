const constants = {
  
  environment: "production",

  apiUrl: "https://new.api.gigatron.rs/",
  resourceUrl: "https://gigatron.rs/",

  devapiUrl: "http://dev.api.gigatron.rs/",
  devResourceUrl: "http://dev.gigatronshop.com/",

  dynamicRoutes: new Array(),

  api: function(){
    return this.environment === 'development' ? this.devapiUrl : this.apiUrl
  },

  resource: function(){
    return this.environment === 'development' ? this.devResourceUrl : this.resourceUrl
  }
};

export default constants;
