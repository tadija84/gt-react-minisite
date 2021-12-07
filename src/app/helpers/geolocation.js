import fetch from "isomorphic-fetch";
//const geo_url = "http://ip-api.com/json";
const geo_url = "https://geoip-db.com/json/";

export const geolocation  = {

    is_load: false,

    marker_list: {},

    navigator: function(){

        var geolocation = navigator.geolocation;
        return new Promise((resolve, reject) => {
            if (!geolocation) {
                reject(new Error('Not Supported'));
            }

            geolocation.getCurrentPosition((position) => {

                this.lat = position.coords.latitude;
                this.lon = position.coords.longitude;
               resolve(this);
            }, () => {
                reject (new Error('Permission denied'));
            });
        });

    },

    load: function(){

            this.is_load = true;

            return new Promise((resolve, reject) => { 
                fetch(geo_url, {
                    method: "GET"
                })
                .then(response => response.json())
                .then(json => {
                        if(json){
                            if(typeof json === 'object'){
                                if(json.status === 'success'){
                                    // this.city = json.city;
                                    // this.country = json.country;
                                    // this.isp = json.isp;
                                    // this.lat = json.lat;
                                    // this.lon = json.lon;
                                    // this.country_code = json.countryCode 
                                }

                                this.city = json.city;
                                this.country = json.country_name;
                                this.isp = json.isp;
                                this.lat = json.latitude;
                                this.lon = json.longitude;
                                this.country_code = json.country_code
                            }
                        }
                    
                    resolve(this);

                }).catch(err => {
                    resolve(null);
                });

                
            });
        
    },

    country: null,

    city: null,

    isp: null,

    lat: null,

    lon: null,

    country_code: null,

    dist: 0.075,

    repeat: 3,

    index: 0,

    zoom: 7,

    center: [44.7924919, 20, 20.4417896],

    near: false,

    close_to_me: false,

    search_event: null,

    nearTo: function(stores, geodata){

        this.close_to_me = false;

        if(!geodata) return null;

        if(this.index > this.repeat) return null;
        
        if(geodata.lon){
            
            this.index++;

            var nearList = [];
            var lX = 0;
            var lY = 0;
            stores.map((store, i)=>{
                var geo = store.geometry;
                var coordinates = geo.coordinates;
                var lat = coordinates[1];
                var lon = coordinates[0];
                //console.log('store -> ', lat,lon, ' user ->', geodata.lat, geodata.lon);
                if( lat > geodata.lat - this.dist && lat < geodata.lat + this.dist){
                    if( lon > geodata.lon - this.dist && lon < geodata.lon + this.dist){
                        nearList.push(store);
                        lX = lX + lat;
                        lY = lY + lon;
                    }
                }
            });

            var lX = lX / (nearList.length);
            var lY = lY / (nearList.length);

            if(nearList.length){
                this.near = true;
                if(nearList > 10){
                    this.zoom = 9;
                } else {
                    this.zoom = 13;
                }

                this.center = [lX,lY];

                return nearList;
            } else {
                this.dist = this.dist + 0.025;
                return this.nearTo(stores, geodata);
            }
        }

        return null;
    },


    distance: function(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
        }
    },

    closeToMe: function(stores, geodata){

        return  new Promise((resolve)=>{

            if(!geodata) {
                this.navigator().then((r)=>{
                    geodata = r;
                  
                    this.storeGeodata(stores, geodata, resolve);
                });
            } else {
       
                this.storeGeodata(stores, geodata, resolve);

            }
        });

        


    },

    storeGeodata: function(stores, geodata, resolve){

        if(!geodata){

            resolve(null);
            return false;
        }

        var distinct = 99999;
        var str = null;
        var data = null;

        stores.map(store => {
            var geo = store.geometry;
            var coordinates = geo.coordinates;
            var lat = coordinates[1];
            var lon = coordinates[0];

            var d = this.distance(lat, lon, geodata.lat, geodata.lon, 'K');
            if(d < distinct){
                distinct = d;
                str = store;
            }
        });

        if(str){
            var list = [];
            list.push(str);
            data = {
                stores: list,
                store: str,
                distinct: (parseFloat(distinct).toFixed(2))
            };
            this.close_to_me = true;
        } else {
            this.close_to_me = false;
        }

        resolve(data);  
    },

    resetMarkers: function(){
        this.marker_list = {};
    },

    markers: function(marker, indx){
        this.marker_list[indx] = marker; 
        return marker;
    }
}