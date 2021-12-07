// The basics
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";

// Action creators and helpers
import { establishCurrentUser, setIsMobile ,   setGeodata  } from "../modules/auth";
import { fetchFavorites } from "./../modules/product";
import {
  setCartItems,
  setCartCount,
  setCartPrice,
  setCartPoints,
  reloadCartItems,

} from "./../modules/cart";

import { isServer } from "../store";



import Routes from "./routes";
import Header from "./bundles/Header";
import Footer from "./bundles/Footer";
import "./app.css";
import "./styles/grid.css";
import "./styles/index.css";
import "./styles/responsive.scss";
import "./styles/form.css";
import "./styles/item.css";
import "./styles/mobile.scss";
import "./styles/desk.scss";

import { fetchHelper } from "./helpers/fetch_helper";
import { StateHelper } from "./helpers/state_helper";
import {isMobile} from "react-device-detect";
import {geolocation} from "./helpers/geolocation";



class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cart: {
        status: false
      },
      user: {
        status: false,
        user: null
      },
      showFilters: false,
      isBusy: false,
      routes: null,
    };

    fetchHelper.app = this;
  }

  componentWillMount() {

    if (!isServer) {
     
      this.props.establishCurrentUser();
      this.props.fetchFavorites();
      this.props.reloadCartItems();
      this.props.setIsMobile(isMobile);
        if(!this.props.geodata && ! geolocation.is_load) {
            geolocation.navigator().then(geo => {
                if (geo) {
                    this.props.setGeodata(geo);
                }
            });
        }
    }
  }

  render() {

    return (
      <div id={"app"} className={this.props.is_mobile ? ' mobile-app':' desk-app'}>
        <div id="content">
          <Header />
          <Routes />
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  favorites: state.product.favorites,
  is_mobile: state.auth.is_mobile,
    geodata: state.auth.geodata
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      establishCurrentUser,
      fetchFavorites,
      setCartItems,
      setCartCount,
      setCartPrice,
      setCartPoints,
      reloadCartItems,
      setIsMobile,
        setGeodata
    },
    dispatch
  );

export default  withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
