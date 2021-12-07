import React, { Component } from 'react';


class Checkbox extends Component {

  constructor(props){
        super(props);
        this.state ={
            value: '',
            isChecked: false
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(props){
       this.setState({value:this.props.value,isChecked:this.props.checked});
       
    }

    componentWillUnmount(){
        
    }

    handleChange(event){
        this.setState({isChecked: !this.state.isChecked}, () => {
            if(this.props.callback != undefined){
                this.props.callback(this.state.isChecked);
            }
        });
    }

    render() {
        return (
            <div className={'checkbox noselect ' + (this.state.isChecked ? 'checked':'')}>
                <input id={this.props.id} type="checkbox" value={this.state.value} onClick={this.handleChange} defaultChecked={this.state.isChecked} />
                <label htmlFor={this.props.id}>{this.props.label}</label>
            </div>
            
        );
    }
}

    export default Checkbox;