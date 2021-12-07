import React, { Component } from 'react';
import {StateHelper} from './../../../helpers/state_helper';
import $ from "jquery";
import './index.css';


import Login from './forms/Login';
import Register from './forms/Register';
import constants from '../../../helpers/constants';

class Registration extends Component {

  constructor(props){
        super(props);
        this.state ={
           currentForm: 'login',
           title: 'Prijava',
           closeStatus: 'show',
           parent: null,
        }

        //this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(props){
       //this.setState({value:this.props.value,isChecked:this.props.checked});
        console.log(this.props.form);
        $('body').addClass('noscroll');
        this.setState({parent:this.props.parent , currentForm: this.props.form});
       
    }

    componentWillUnmount(){
        
    }

    close(){
        this.closeLogin();
    }


    form(){
        switch(this.state.currentForm){
            case 'login':
                return <Login parent={this} />
             case 'register':
                return <Register parent={this} />
            default:
                return <Login parent={this} />
        }
    }

    registrationView(){
        return (
            <div>
                <h3 className="reg-title">Registracija</h3>           
                <img src={constants.resource() + "assets/img/layout/bgr-reg-fizicko-lice.jpg"} height="200px" />
                <p>Ako još uvek nemate Gigatron nalog, možete kreirati sada.</p>
                <button className="reg-btn" onClick={()=>this.switchView('register','Registracija')}>Registracija</button>
            </div>
        );
    }

    switchView(view,title){
        this.setState({title:title});
        this.setState({currentForm:view});
    }

    loginView(){
        return (
            <div>
                <h3 className="reg-title">Prijava</h3>           
                <img src={constants.resource() + "assets/img/layout/bgr-reg-fizicko-lice.jpg"} height="200px" />
                <p>Ako imate Gigatron nalog, prijavite se sada.</p>
                <button className="reg-btn" onClick={()=>this.switchView('login','Prijava')}>Prijava</button>
            </div>
        );
    }

    closeLogin(){
        $('body').removeClass('noscroll');
        this.props.parent.closeLogin();
    }

    sidepage(){
        switch(this.state.currentForm){
            case 'login':
                return this.registrationView();
            case 'register':
                return this.loginView();
            default:
                return this.registrationView();
        }
    }

    /*handleChange(event){
        this.setState({isChecked: !this.state.isChecked}, () => {
            if(this.props.callback != undefined){
                this.props.callback(this.state.isChecked);
            }
        });
    }*/

    render() {
        return (
            <div className="pop-mask">
                <div className="pop-window">
                    <div className="pop-header">
                        <h4>{this.state.title}</h4>
                    </div>
                    <div className="pop-container">
                        <div className="row full-height">
                            <div className="col col-12 full-height">
                                {this.form()}
                            </div>
                        </div>
                    </div>
                    <div className="pop-footer">
                        <button onClick={()=>this.close()} className={this.state.closeStatus} >Zatvori</button>
                    </div>
                </div>
            </div>
        );
    }
}

    export default Registration;