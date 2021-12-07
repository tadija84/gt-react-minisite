import React, { Component } from "react";
import './stil2.css';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';


class PopProzor extends Component {

    render() {
         return (
             <div className="main-container">
                <div className="kartica">
                    <div className="left-container">
                    <img src="http://bloggers.miodragovic.com/ftp2/public_html/Death%20Adder.png" alt=""/>
                </div>
                <div className="right-container">

                <h2>DeathAdder Left-Hand Edition</h2>

                    <ul className="lista">
                        <li>Ergonomic left hand design</li>
                        <li>3500DPI Razer Precision 3.5G infrared sensor</li>
                        <li>1000Hz Ultrapolling / 1ms response</li>
                        <li>Five independently programmable Hyperesponse buttons</li>
                        <li>On-The-Fly Sensitivity adjustment</li>
                        <li>Always-On mode</li>
                        <li>Razer Synapse 2.0 enabled</li>
                        <li>Ultra-Large non-slip buttons</li>

                    </ul>

                <h3>US$59,99</h3>
                <Button className="dugme">Buy</Button>
                </div>
            
                </div>
            </div>
         );
     }
   }
   
     export default PopProzor;


 


