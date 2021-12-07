import React from 'react';
import './style.css';
import Modal from 'react-responsive-modal';

class Popup extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            open: false,
        }
    }
    onOpenModal = () => {
        this.setState({ open: true });
      };
     
      onCloseModal = () => {
        this.setState({ open: false });
    };

   render() {
    const { open } = this.state;
    var content = this.props.content;
        return(
            <div>
                <button onClick={this.onOpenModal}>Learn more</button>
                <Modal open={open} onClose={this.onCloseModal} closeOnOverlayClick closeOnEsc center>
                    <div className="left-container">
                       <img src={content.img} alt="laptop"></img>
                    </div>

                   <div className="right-container">
                       <h1>Title</h1>
                        <p>{content.content}</p>
                       <ul>
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
                       <button>Learn more</button>
                   </div>
                </Modal>
          </div>
        );
 
   }
}



export default Popup;