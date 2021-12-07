import React, { Component } from "react";
import { withRouter } from "react-router";
import Hammer from "react-hammerjs";
import $ from 'jquery';
import './index.scss';

class Swiper extends Component {

    constructor(props) {
        super(props);

        this.state = {
            start: false,
            end: false,
            distance: 0
        };

        this.onPress = this.onPress.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }
  
    componentDidMount(){
        
    }

    onPress(event){
        if(event.direction === 2 && event.additionalEvent === 'panleft' && event.deltaX < event.deltaY && event.deltaY > -1){
            if(this.state.start === false){
                this.setState({start:true});
            }

            if(this.state.start){
                this.setState({distance:event.distance});
            }
        }
    }


    onEnd(event){
        
        if(this.state.distance > this.props.action){
            this.setState({end:true});
            setTimeout(()=>{
                $('.swiper-'+this.props.index).slideUp(150,()=>{
                    this.props.onDelete()
                });
            }, 350);
        } else {
            this.setState({distance:0, start: false});
        }
    }

    distance(){
        if(this.state.end === false){
            return 'translateX(-' + this.state.distance+'px)';
        } else {
            return 'translateX(-101%)';
        }
    }

    render() {
        const { children, id, className, ...rest } = this.props;

        return (
            <div className="swiper-holder">
                <div className={"swiper swiper-" + this.props.index} style={{transform:this.distance()}}>
                    <Hammer onPan={(event)=>this.onPress(event)} onPanEnd={(event)=>this.onEnd(event)} >{children}</Hammer>
                </div>
                {this.props.append !== undefined?this.props.append:''}
        </div>
        );
    }
}

export default withRouter(Swiper);