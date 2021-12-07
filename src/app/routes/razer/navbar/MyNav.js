import React, { Component } from "react";
import './style.css';
import { Link } from 'react-router-dom';


class MyNav extends Component {

  componentDidMount() {
    var navbar = document.getElementById("navbar");
    var sticky = navbar.offsetTop;
    window.addEventListener('scroll', (event) => {
      if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
      } else {
        navbar.classList.remove("sticky");
      }
    });
  }

  render() {
    return (
      <div className="container" id="navbar">
        <Link to="/">
        <div className="logo">
          <img src="http://bloggers.miodragovic.com/ftp2/public_html/razer-fixed.png" alt="Razer"></img>
        </div>
        </Link>
        <nav className="navigation">
        <div className="dropdown">
                <a className="dropbtn">PRODUCTS</a>
                <div className="dropdown-content">
                <Link to={'../proizvodi/laptopovi'}>Laptops</Link>
                <a href="#">Mobile</a>
                <a href="#">Mice & Mats</a>
                <a href="#">Keyboards</a>
                <a href="#">Headsets & Audio</a>
                <a href="#">Broadcaster</a>
                <a href="#">Console [PS4 / Xbox]</a>
                <a href="#">Desktops, Display & Routers</a>
                <a href="#">Licensed & Collestions</a>
                <a href="#">Gear, Apparel & Bag</a>
                <a href="#">Razer Gold & Silver</a>
                </div>
                </div>
                <div className="dropdown">
                <a className="dropbtn">SOFTWARE</a>
                <div className="dropdown-content">
                <a href="#">Cortex Game Booster</a>
                <a href="#">Synase 3IOT Drivers (beta)</a>
                <a href="#">Chroma RGB</a>
                <a href="#">SoftMiner (beta)</a>
                <a href="#">Synapse 2.0 (legacy)</a>
                </div>
                </div>
                <div className="dropdown">
                <a className="dropbtn">COMMUNITY</a>
                <div className="dropdown-content">
                <a href="#">Get Started</a>
                <a href="#">Insider</a>
                <a href="#">Esports</a>
                <a href="#">Campaigns</a>
                <a href="#">Developers</a>
                <a href="#">Chroma Workshop</a>
                <a href="#">Made With Blade</a>
                <a href="#">Media & Downloads</a>
                <a href="#">Concepts</a>
                <a href="#">Chroma Workshop</a>

                </div>
                </div>
                <div className="dropdown">
                <a className="dropbtn">STORE</a>
                <div className="dropdown-content">
                <a href="#">RazerStore (Online)</a>
                <a href="#">RazerStore (Retail)</a>
                </div>
                </div>
                <div className="dropdown">
                <a className="dropbtn">SUPPORT</a>
                <div className="dropdown-content">
                <a href="#">Product Support</a>
                <a href="#">Returns and Refunds</a>
                <a href="#">RazerCare Protection Plan</a>
                <a href="#">Product Registration</a>
                <a href="#">Warrenty Information</a>
                </div>
                </div>

        </nav>

        <div className="icons">
          <img src="http://bloggers.miodragovic.com/ftp2/public_html/loupe.svg" onClick={this.props.toggle.bind(this)} alt="loupe"></img>
          <img src="http://bloggers.miodragovic.com/ftp2/public_html/cart.svg" alt="cart"></img>
        </div>
      </div>
    );
  }
}



export default MyNav;