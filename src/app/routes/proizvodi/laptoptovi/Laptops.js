import React, { Component } from "react";
import "./stil.css"
import { dbstore } from './../../../components/database/dbstore';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';
import Popup from "../../razer/popup/Popup"

class Laptops extends Component {

  state = { show: false }

  toggleModal = () => {

     this.setState({ show: !this.state.show })

     console.log(this.state.show)
  }

  item() {
     if (!dbstore.laptops.length) return (<div className="page-error">Ne postoje kreirane komponente.</div>);
     return dbstore.laptops.map((item, indx) => (
        <div className="jedanLap" key={indx}>


           <Card>
              <CardImg top src={item.img} alt="Card image cap" />
              <CardBody>
                 <CardTitle><h3>{item.name}</h3></CardTitle>
                 <CardSubtitle></CardSubtitle>
                 <CardText className="par">{item.content}</CardText>
               
                 <Popup content={item} />
              </CardBody>
           </Card>

           {/* {this.state.show && <Modal />} */}
        </div>
     ));
  }

  render() {
     return (
        <div className="sviLapovi">{this.item()}</div>

     );
  }
}

export default Laptops;