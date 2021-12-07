import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Link,
  NavLink,
  Route,
  withRouter
} from "react-router-dom";
import { fetchHelper } from "../../helpers/fetch_helper";
import { slugify } from "../../helpers/url_helper";
import Registration from "../../components/Widgets/MobileRegistration";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchNavigation, fetchSubNavigation } from "./../../../modules/navigation";
import { slide as Menu } from 'react-burger-menu';
import $ from "jquery";

import "./style.css";
import { StateHelper } from "../../helpers/state_helper";

var xxxn = "x";
class Navigation extends Component {
  constructor(props) {
    super();
    this.state = {
      items: null,
      hdActive: null,
      headNavShow: false,
      rndIndx: null,
      sideMenuOpen: false,
      menuOpen: false,
      showLogForm: false,
      formType: 'login',
    };
    this.switchTimeout = null;
    this.switchDelay = 100;
    this.switchBusy = false;
    this.showMainNavTimeout = null;
    this.is_unmount = false;

    this.toggleDrop = this.toggleDrop.bind(this);
    this.showDrop = this.showDrop.bind(this);
    this.toggleMobile = this.toggleMobile.bind(this);
    this.hideDrop = this.hideDrop.bind(this);
    this.switchDrop = this.switchDrop.bind(this);
    this.hdNavClickMain = this.hdNavClickMain.bind(this);
    this.activeLevel = this.activeLevel.bind(this);
    this.mainLevel = this.mainLevel.bind(this);
    this.burgerMenuClick = this.burgerMenuClick.bind(this);
    this.SubMenuHeaderLinkClick = this.SubMenuHeaderLinkClick.bind(this);
    this.setBusyLoader = this.setBusyLoader.bind(this);
    this.closeHeadNav = this.closeHeadNav.bind(this);

    this.closeSudeMenu = this.closeSudeMenu.bind(this);
  }


  componentDidMount() {
    this.props.fetchNavigation();
    this.props.fetchSubNavigation();
  }


  shouldComponentUpdate() {
    var s = this.state.rndIndx === xxxn || !this.props.items ? false : true;

    return true;
  }

  forceUpdatePage() {
    var rnd = Math.floor(Math.random() * 100000);

    this.setState({ rndIndx: rnd });
  }

  openLogin(event , formType) {
    event.preventDefault();
    this.setState({ showLogForm: true , formType: formType});
    return false;
  }

  closeLogin() {
    this.setState({ showLogForm: false });
  }

  registrationForm(form) {
    if (this.state.showLogForm) return <Registration form={form} parent={this} />;
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    var nm = $("body").find("#header-nav");
    if (nm.length) {
      nm.find("a").unbind("click");
    }
  }

  removeHtml(string) {
    var div = document.createElement("div");
    div.innerHTML = string;
    return div.textContent || div.innerText || "";
  }

  toggleDrop(e) {
    e.stopPropagation();
    $("nav").removeClass("level-1");
    var t = e.target.dataset.toggle;
    $("#" + t).toggleClass("active");
    if ($("#" + t).hasClass("active")) {
      $(".megamenu-drop-mask").addClass("active");
    } else {
      $(".megamenu-drop-mask").removeClass("active");
    }
  }

  showDrop(e) {
    e.stopPropagation();
    var t = e.target.dataset.toggle;
    var btn = $(e.target);
    $("nav").removeClass("level-1");
    $(".megamenu-drop ul li").removeClass("mactive");

    clearTimeout(this.showMainNavTimeout);
    this.showMainNavTimeout = setTimeout(() => {
      $("#" + t).addClass("active");
      $(".megamenu-drop-mask").addClass("active");
    }, 350);

    btn.unbind().on("mouseleave", () => {
      if (!$("#" + t).hasClass("active")) {
        clearTimeout(this.showMainNavTimeout);
      }
    });
  }

  hideDrop(e) {
    clearTimeout(this.showMainNavTimeout);
    $(".megamenu-drop").removeClass("active");
    $(".megamenu-drop-mask").removeClass("active");
    $(".megamenu-drop ul li").removeClass("mactive");
    $("nav").removeClass("level-1");
  }

  switchDrop(e) {
    var el = $("body").find("#main-nav-" + e);

    clearTimeout(this.switchTimeout);
    this.switchTimeout = setTimeout(
      e => {
        this.switchBusy = false;
        $(el)
          .closest("ul")
          .find("li")
          .removeClass("active");
        $(el).addClass("active");
      },
      this.switchDelay,
      e
    );
  }
  handleSideMenuStateChange (state) {
    this.setState({menuOpen: state.isOpen})  
  }
  
  // This can be used to close the menu, e.g. when a user clicks a menu item
  closeSudeMenu () {
    this.setState({menuOpen: false})
    
  }
  toggleSideMenu () {
    this.setState({menuOpen: !this.state.menuOpen})
  }
  activeLevel(e) {
    var level = e.target.dataset.level;
    $(".megamenu-drop ul li").removeClass("mactive");
    $(e.target)
      .closest("li")
      .addClass("mactive");
    $("nav").addClass("level-1");
  }

  mainLevel(e) {
    $("nav").removeClass("level-1");
    $(".megamenu-drop ul li").removeClass("mactive");
  }

  SidebarItems() {
    if (!this.props.items) return <div />;

    setTimeout(() => {
      $(".megamenu-drop a")
        .unbind()
        .on("click", e => {
          this.hideDrop(e);
          return true;
        });
    }, 500);

    return Object.keys(this.props.items).map(e => {
      var item = this.props.items[e];
      return (
        <li
          key={"itm-" + item.id}
          id={"main-nav-" + item.id}
          className="clear"
          onMouseOver={() => this.switchDrop(item.id)}
        >
          <Link to={item.link}>{item.title}</Link>
          {this.props.is_mobile ? (
            <div className="next" onClick={this.activeLevel} data-level="2">
              <i className="fa fa-angle-right" />
            </div>
          ) : (
            ""
          )}

          <ul>
            <li className="clear">{this.columns(item.columns, item.id)}</li>
          </ul>
        </li>
      );
    });
  }

  columns(columns, id) {
    return Object.keys(columns).map((e, i) => {
      var column = columns[e];
      return (
        <ul key={"col-" + id + "-" + i} className="column">
          {this.columnItems(column)}
        </ul>
      );
    });
  }

  columnItems(column) {
    return column.map((col, i) => {
      return (
        <li className={"item-nav" + col.type} key={"colitm-" + i}>
          {this.item(col)}
        </li>
      );
    });
  }

  setBusyLoader() {
    fetchHelper.app.setState({ isBusy: true });
  }

  item(col) {
    switch (col.type) {
      case "image":
        if (col.link) {
          return (
            <figure>
              <Link to={col.link} onClick={this.setBusyLoader}>
                <img src={col.src} alt={this.removeHtml(col.title)} />
              </Link>
            </figure>
          );
        } else {
          return (
            <figure>
              <img src={col.src} alt={this.removeHtml(col.title)} />
            </figure>
          );
        }
      case "head_title":
        if (col.link) {
          return (
            <h3>
              <Link to={col.link} onClick={this.setBusyLoader}>
                {this.removeHtml(col.title)}
              </Link>
            </h3>
          );
        } else {
          return <h3>{this.removeHtml(col.title)}</h3>;
        }
      case "title":
        if (col.link) {
          return (
            <h3>
              <Link to={col.link} onClick={this.setBusyLoader}>
                {this.removeHtml(col.title)}
              </Link>
            </h3>
          );
        } else {
          return <div className="menu-title">{this.removeHtml(col.title)}</div>;
        }

      case "link":
        return (
          <Link
            to={col.link}
            className="menu-link"
            onClick={this.setBusyLoader}
          >
            {this.removeHtml(col.title)}
          </Link>
        );
      case "boxlink":
        return (
          <h3>
            <Link
              to={col.link}
              style={{ backgroundColor: col.background, color: col.color }}
              className="box-link"
              onClick={this.setBusyLoader}
            >
              {this.removeHtml(col.title)}
            </Link>
          </h3>
        );
    }
  }

  burgerMenuClick(e) {
    var s = this.state.headNavShow == true ? false : true;
    this.setState({ headNavShow: s });
  }

  SubMenuHeaderLinkClick(e) {
    this.setState({ headNavShow: false });
  }

  hdMenu() {
    if (this.props.hide === true) return "";
    if (!this.props.subitems) return;

    var menu = this.props.subitems;

    if (this.props.hdmenu !== true) {
      setTimeout(() => {
        $("body")
          .find(".header-nav ul li > ul li a")
          .unbind()
          .on("click", () => {
            this.setState({ hdActive: false });
            xxxn = this.state.rndIndx;
          });
      }, 1000);
    }
    return (
      <div className="header-nav">
        <div className="burger-menu" onClick={() => this.burgerMenuClick()}>
          <span />
          <span />
          <span />
        </div>
        {this.props.is_mobile && this.props.hdmenu !== true && this.props.user ? (
          <ul id="mobile-user-widget">{this.props.user}</ul>
        ) : (
          ""
        )}
        {this.state.hdActive ? (
          <div className="head-nav-mask" onClick={() => this.closeHeadNav()} />
        ) : (
          ""
        )}
        <ul
          id="header-nav"
          className={
            this.state.headNavShow === true ? "show head-nav" : "hiden head-nav"
          }
        >
          {Object.keys(menu).map((a, i) => {
            var item = menu[a];
            return (
              <li key={"hm-" + i}>
                {item.items ? (
                  <a
                    data-id={item.id}
                    onClick={e => this.hdNavClickMain(e)}
                    className={
                      (item.highlight == 1 ? "highlight" : "") +
                      (item.id == this.state.hdActive ? " active" : "")
                    }
                  >
                    {item.title}
                  </a>
                ) : (
                  <Link
                    to={item.link}
                    className={item.highlight == 1 ? "highlight" : ""}
                    onClick={() => this.SubMenuHeaderLinkClick()}
                  >
                    {item.title}
                  </Link>
                )}

                {item.items ? (
                  <ul
                    className={
                      this.state.hdActive == item.id ? "active" : "hidden"
                    }
                  >
                    {Object.keys(item.items).map((e, n) => {
                      var col = item.items[e];
                      return (
                        <li key={"hdusb-" + n} className="submenu">
                          {col.map((subitem, i) => {
                            return (
                              <Link
                                key={"subitm-" + i + "-" + subitem.id}
                                to={subitem.link}
                                onClick={() => this.SubMenuHeaderLinkClick()}
                              >
                                {subitem.title}
                              </Link>
                            );
                          })}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  ""
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  handleMobileMenuClick(event){
    event.preventDefault();
    this.setState({menuOpen: false});
  }
  middleMobileNav(){
    return (
      <div className="middle-menu">
        <ul>
          <NavLink exact onClick={this.closeSudeMenu} to="/">
          <li>
            <i className="fa fa-home" aria-hidden="true"></i> Početna
          </li>
          </NavLink>
          <NavLink exact onClick={this.closeSudeMenu} to="/pretraga">
          <li>
          <i className="fa fa-search" aria-hidden="true"></i> Pretraga
          </li>
          </NavLink>
          <NavLink exact onClick={this.closeSudeMenu} to="/#kategorije">
          <li>
           <i className="fa fa-th-large" aria-hidden="true"></i> Kategorije
          </li>
          </NavLink>
          <NavLink exact onClick={this.closeSudeMenu} to="/lista-zelja">
          <li>
           <i className="fa fa-heart" aria-hidden="true"></i> Lista želja
          </li>
          </NavLink>
          <NavLink exact onClick={this.closeSudeMenu} to="/prodavnice">
          <li>
           <i className="fa fa-shopping-bag" aria-hidden="true"></i> Prodavnice
          </li>
          </NavLink>
          <NavLink exact onClick={this.closeSudeMenu} to="/korpa">
          <li>
             <i className="fa fa-shopping-cart" aria-hidden="true"></i> Korpa
          </li>
          </NavLink>
        </ul>
      </div>
    );
  }
  menuMobileContent(){
  
    var user = this.props.currentUser;
 
    return(
      <div>
        <div className="sidebar-mobile">
          {user == null ? (
            <div className="profile-setup">
            <div className="profile-avatar">
              <img src={fetchHelper.api_url + "assets/img/user/man-profile.png"} />
            </div>
            <div className="log-reg-button">
              <ul>
                <li onClick={event => this.openLogin(event , 'login')}>Uloguj se</li>
                <li onClick={event => this.openLogin(event , 'register')}>Registruj se</li>
              </ul>
            </div>
            </div>
           ) : (
            <div className="profile-setup">
              <Link  onClick={this.closeSudeMenu} to="/korisnik" ><div className="profile-avatar">
                <img src={fetchHelper.api_url + "assets/img/user/man-profile.png"}  />
                </div>
                <div className="profile-name">
                  <h2>{user.name}</h2>    
                </div>
              </Link>
    
            </div>
            
          )}  
          </div>  
          {this.middleMobileNav()}
       
      </div>
    )
  }
  hdNavClickMain(e) {
    var el = e.target;
    var indx = el.dataset.id;
    if (this.state.hdActive == indx) indx = null;
    this.setState({ hdActive: indx });
    //this.forceUpdatePage();
  }
 
  closeHeadNav() {
    this.setState({ hdActive: null });
  }
  toggleMobile(){
    console.log('aca je lud');
    return (<div className="mobile-extense">haha</div>)
  }
  render() {
    
    if (this.props.hdmenu === true) return this.hdMenu();

    return (
      <nav className={this.props.is_mobile ? "mobile" : "desktop"}>
        {this.registrationForm(this.state.formType)}
        <div className="main-navigation clear noselect">
         {this.props.is_mobile ? (
          <Menu width={'80%'} isOpen={this.state.menuOpen}  onStateChange={(state) => this.handleSideMenuStateChange(state)}>
            {this.menuMobileContent()}
          </Menu>
        ) : (
          <div>
          <button
            data-toggle="megamenu"
            className="megabtn"
            onClick={this.toggleDrop}
            onMouseOver={this.showDrop}
          >
            Proizvodi
          </button> 
          {this.hdMenu()}
          </div>
        )}
        </div>
        <div
          className="megamenu-drop clear"
          id="megamenu"
          onMouseLeave={this.hideDrop}
        >
          <ul>
            {this.props.is_mobile ? (
              <div className="back-level" onClick={this.mainLevel}>
                <i className="fa fa-angle-left" /> Nazad
              </div>
            ) : (
              ""
            )}
            {this.props.is_mobile ? (
              <div className="back-menu" onClick={this.hideDrop}>
                <i className="fa fa-angle-left" /> Zatvori
              </div>
            ) : (
              ""
            )}
            {this.SidebarItems()}
          </ul>
        </div>
        <div className="megamenu-drop-mask" onClick={this.hideDrop} />
      </nav>
    );
  }
}


const mapStateToProps = state => ({
    items: state.navigation.items,
    subitems: state.navigation.subitems,
    is_mobile: state.auth.is_mobile,
    currentUser: state.auth.currentUser,
  });
  
  const mapDispatchToProps = dispatch =>
    bindActionCreators(
      { fetchNavigation, fetchSubNavigation },
      dispatch
    );
  
  export default withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Navigation)
  );
