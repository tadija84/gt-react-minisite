import React, { Component } from "react";
import './stil.css';
import Laptops from "./Laptops";
import ToggleNav from "../../razer/toggle/ToggleNav";
import PopProzor from "./PopProzor";

class Laptop extends Component {

 render() {
      return (
        <div>
        <ToggleNav />
       <Laptops/>
        <PopProzor/>
       </div>
      );
  }
}

  export default Laptop;