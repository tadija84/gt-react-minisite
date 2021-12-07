import React, { Component } from "react";
import ReactDom from "react-dom";
import Page from "../../components/page";

import logo from "../../assets/logo.jpg";
import "./style.css";
import Test from "../razer/test/Test";
import Slider from "../razer/slider/Slider"
import ToggleNav from "../razer/toggle/ToggleNav";
import Popup from "../razer/popup/Popup";




class Homapage extends Component {
  render() {
    return (
      <div className="">
        <ToggleNav />
        <Slider />
        <Test />
      </div>
    );
  }
}

export default Homapage;
