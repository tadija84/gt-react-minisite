import React, { Component } from "react";
import './navstyle.css'

class NavSearch extends Component {

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
            <div class="container" id="navbar">
                <div class="logo">
                    <img src="http://bloggers.miodragovic.com/ftp2/public_html/razer-fixed.png" alt="Razer"></img>
                </div>
                <input type="text" class="field" placeholder="Search Razer Products..." />

                <div class="icons">
                    <img src="http://bloggers.miodragovic.com/ftp2/public_html/cancel.svg" onClick={this.props.toggle.bind(this)} alt="loupe"></img>
                    <img src="http://bloggers.miodragovic.com/ftp2/public_html/cart.svg" alt="cart"></img>
                </div>
            </div>

        );
    }
}



export default NavSearch;