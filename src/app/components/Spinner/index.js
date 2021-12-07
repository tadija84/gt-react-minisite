import React, { Component } from 'react';



class Spinner extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount(props) {
        
    }



    render() {
        return (
            <div className="spinner" style={{width:this.props.size+'px',height:this.props.size+'px'}}></div>
        );
    }
}

export default Spinner;
