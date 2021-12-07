import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { configs } from "../../configs/static";
import SearchBox from "./../SearchBox";
import Navigation from "./../Navigation";
import { StateHelper } from "../../helpers/state_helper";
import { fetchHelper } from "../../helpers/fetch_helper";
import $ from "jquery";
import Registration from "../../components/Widgets/Registration";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchFavorites } from "./../../../modules/product";
import { establishCurrentUser } from "./../../../modules/auth";
import { removeCartItem, addCartItem } from "./../../../modules/cart";
import MobileHeader from "./mobile_index";
import "./desktop_header.scss";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";

import logo from "./img/logo.svg";
import mobilelogo from "./img/mobilelogo.svg";

class DesktopHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sticky: false,
      showLogForm: false,
      rndIndx: null,
      user: null
    };

    this.shouldComponentUpdateStatus = false;

    this.bindCloseFilters = this.bindCloseFilters.bind(this);
    this.removeCartItem = this.removeCartItem.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidMount() {
    global.window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  componentWillMount() {
    this.props.establishCurrentUser();
  }

  componentWillUnmount() {
    global.window.removeEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll(event) {
    var doc = document.documentElement;
    var top =
      (global.window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

    if (top > 100) {
      this.setState({ sticky: false });
    } else {
      this.setState({ sticky: false });
    }
  }

  getLogoSrc() {
    return logo;
  }

  removeCartItem(id) {
    this.props.removeCartItem(id);
  }

  sticky_header() {
    if (this.state.sticky == false) {
      return (
        <ul>
          <li>
            <div className="contact">
              <span>Fizička lica</span> <span>011 44 14 000</span>
            </div>
          </li>
          <li>
            <div className="contact">
              <span>Pravna lica</span> <span>011 44 14 010</span>
            </div>
          </li>
        </ul>
      );
    } else {
      return (
        <ul>
          <li>
            <Link to="/" id="logo-sticky">
              <img id="logo-sticky-img" src={this.getLogoSrc()} />
            </Link>
            <div id="searchbox-sticky">
              <SearchBox />
            </div>
          </li>
        </ul>
      );
    }
  }

  closeFilters() {
    return (
      <li className="cart noselect">
        <div className="close-filters" onClick={this.bindCloseFilters}>
          Zatvori filtere
        </div>
      </li>
    );
  }

  bindCloseFilters() {
    $("body")
      .find(".filters-view")
      .css("display", "none");
    fetchHelper.app.setState({ showFilters: false });
  }

  quantity(p, state_qty) {
    var cq = parseInt(p.quantity);
    if (state_qty) {
      cq++;
    } else {
      cq--;
    }

    if (cq < 0) cq = 1;

    if (cq === "NaN" || isNaN(cq)) {
      cq = 1;
    }

    this.props.addCartItem(p, cq);
  }

  bundle(p) {
    if (p.session !== undefined) {
      switch (p.session.type) {
        case "BUNDLE_SINGLE":
          return (
            <div className="bundle-badge">
              <span>Bundle</span>
            </div>
          );
          break;
        case "BUNDLE_GROUP":
          return (
            <div className="bundle-items">
              {Object.keys(p.bundle_items).map((k, i) => (
                <span key={i}>
                  <img
                    src={p.bundle_items[k].image}
                    alt={p.bundle_items[k].name}
                  />
                </span>
              ))}
            </div>
          );
          break;
        default:
          break;
      }
    }
  }

  cart() {
    return (
      <li className="cart noselect">
        <div className="cart-hidden">
          <i>
            {this.props.cart_price} <small>din</small>{" "}
          </i>
          <small>
            <span>
              <i>(</i>
              {this.props.cart_count}
              <i>)</i>
            </span>
          </small>
        </div>
        <div className="cart-preview">
          <i>
            {this.props.cart_price} <small>din</small>{" "}
          </i>
          <small>
            <span>
              <i>(</i>
              {this.props.cart_count}
              <i>)</i>
            </span>
          </small>
          <ul>
            {Object.keys(this.props.cart).map((e, i) => {
              var p = this.props.cart[e];
              return (
                <li key={p.id}>
                  <div className="cart-producut-preview clear noselect">
                    <figure>
                      <Link to={p.url}>
                        <img src={p.image.sizes.small} />
                      </Link>
                    </figure>
                    <div className="cart-right-side">
                      <h4>
                        <Link to={p.url}>{p.title}</Link>
                      </h4>
                      {this.bundle(p)}
                    </div>
                    <div
                      className="cart-remove"
                      onClick={() => this.removeCartItem(p.id)}
                    >
                      ×
                    </div>
                    <div className="bottom-side clear">
                      <i
                        className="fa fa-angle-left"
                        aria-hidden="true"
                        onClick={() => this.quantity(p, 0)}
                      />{" "}
                      ({p.quantity} x {p.prices.price.formated}){" "}
                      <i
                        className="fa fa-angle-right"
                        aria-hidden="true"
                        onClick={() => this.quantity(p, 1)}
                      />{" "}
                      <span>{p.total_formated}</span>
                    </div>
                  </div>
                </li>
              );
            })}
            <li className="cart-preview-footer">
              <Link to="/korpa" className="to-cart-link">
                Moja korpa{" "}
                <i className="fa fa-angle-right" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </li>
    );
  }

  favorite() {
    if (this.props.favorites.length) {
      return (
        <ul>
          <li id="tp-favorite">
            <Link to="/korisnik#wishlist">
              {this.props.favorites.length} <i className="fa fa fa-heart" />
            </Link>
          </li>
        </ul>
      );
    }
  }

  logout() {
    StateHelper.LOGOUT();
  }

  adOceanHeader() {
    return "<script>ado.master({id: 'HN5F7nAiPTJPCK7mduM541mLclFQkX6VT9YgivzCFDH.i7', server: 'ocean.gigatron.rs' });ado.slave('adoceanrslclqgunhbf', {myMaster: 'HN5F7nAiPTJPCK7mduM541mLclFQkX6VT9YgivzCFDH.i7' });</script>";
  }
  user() {
    return (
      <li className="user">
        {this.props.isAuthenticated ? (
          <div className="user-opt drop-menu noselect">
            <span className="user-identity-name">
              <i className="fa fa-user" /> <b>{this.props.currentUser.name}</b>
            </span>
            <div className="drop-menu-holder">
              <ul>
                <li>
                  <Link to="/korisnik">Moj profil </Link>
                </li>
                <li>
                  <Link to="/korisnik#carthistory">Istorija kupovine</Link>
                </li>
                <li>
                  <Link to="/korisnik#wishlist">Lista želja</Link>
                </li>
                <li>
                  <Link to="/korisnik#history">Prethodno pregledani</Link>
                </li>
                <li>
                  <Link to="/korpa">Moj korpa</Link>
                </li>
                <li>
                  <Link to="/logout">Odjava</Link>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="user-opt drop-menu noselect">
            <a onClick={() => this.openLogin()}>
              <span className="hd-reg">Prijava</span>{" "}
              <span className="separator" />{" "}
              <span className="hd-reg">Registracija</span>
            </a>
          </div>
        )}
      </li>
    );
  }

  openLogin() {
    this.setState({ showLogForm: true });
  }

  closeLogin() {
    this.setState({ showLogForm: false });
  }

  registrationForm() {
    if (this.state.showLogForm) return <Registration parent={this} />;
  }

  render() {
    return (
      <div className="desktop-header">
        <div className="top-header clear">
          {this.sticky_header()}

          <ul>
            {fetchHelper.app.state.showFilters
              ? this.closeFilters()
              : this.cart()}
            {this.user()}
          </ul>
          {this.favorite()}
        </div>
        <div className="wrap bg-dark">
          <div className="theme-wrap">
            <header className="clear">
              <Link to="/" id="logo">
                <img id="logo-img" src={this.getLogoSrc()} />
              </Link>
              <div id="searchbox">
                <SearchBox />
              </div>
              <div className="header-ocean">
                <div id="adoceanrslclqgunhbf" />
                {ReactHtmlParser(this.adOceanHeader())}
              </div>
            </header>
            <div id="navigation">
              <Navigation user={this.user()} />
              <div id="subheader" />
            </div>
          </div>
          {this.registrationForm()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  favorites: state.product.favorites,
  currentUser: state.auth.currentUser,
  isAuthenticated: state.auth.isAuthenticated,
  cart: state.cart.cart,
  cart_price: state.cart.price,
  cart_count: state.cart.count,
  cart_points: state.cart.points
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { establishCurrentUser, removeCartItem, addCartItem },
    dispatch
  );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DesktopHeader)
);
