import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Link,
  Route,
  withRouter
} from "react-router-dom";

import $ from 'jquery';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setSubitemsNavigation } from "./../../../modules/navigation";




class Submenu extends Component {
  constructor(props) {
    super();
    this.state = {
      hdActive:null
    };
  
    this.hdNavClickMain = this.hdNavClickMain.bind(this);
    this.closeNavSubitems = this.closeNavSubitems.bind(this);

  }

  componentDidMount() {
    
  }


  hdNavClickMain(e) {
    var el = e.target;
    var indx = el.dataset.id;
    if (this.state.hdActive == indx) indx = null;
    this.setState({ hdActive: indx });
    
    if(indx){
      $('body,html').addClass('body-noscroll');
    } else {
      $('body,html').removeClass('body-noscroll');
    }
  }

  closeNavSubitems(){
    this.setState({hdActive:null});
    $('body,html').removeClass('body-noscroll');
  }

  subitemsMenu(){
    if(!this.props.subchhild) return;

    

    return this.props.subchhild.map((iy,index)=>{
        
        return Object.keys(iy.items).map((a,i)=>{
            var list = iy.items[a];
            var id = iy.parent_id;
            return (<div className={"submenu_items"+(this.state.hdActive===id?' active':'')} key={'submenu-'+index+'-'+i} >
                {list.map((item,y)=>{
                    return (<Link to={item.link} key={'smn-'+index+'-'+i+'-'+y}  onClick={()=>this.closeNavSubitems()}>{item.title}</Link>);
                })}
            </div>);
        });
    });
  }

  render(){

    if(!this.props.is_mobile) return '';
    if(!this.props.subitems) return '';
    
    

    return (
        <div className="subheader-container">
            <div className="subheader-mobile">
                <div>
                    <ul>
                        {Object.keys(this.props.subitems).map((a, i) => {
                        var item = this.props.subitems[a];
                        return (
                            <li key={"hm-" + i}>
                            {item.items ? (
                                <a
                                data-id={item.id}
                                onClick={e => this.hdNavClickMain(e)}
                                className={
                                    (item.highlight == 1 ? "highlight" : "") +
                                    (item.id == this.state.hdActive ? " active" : "")
                                }
                                >
                                {item.title}
                                </a>
                            ) : (
                                <Link
                                to={item.link}
                                className={item.highlight == 1 ? "highlight" : ""} 
                                onClick={()=>this.closeNavSubitems()}
                                >
                                {item.title}
                                </Link>
                            )}
                            </li>
                        );
                        })}
                    </ul>
                </div>
            </div>
            {this.subitemsMenu()}
            {this.state.hdActive ? (<div className="subitem-mask" onClick={()=>{this.closeNavSubitems()}}></div>):('')}
        </div>
      );
  }

}


const mapStateToProps = state => ({
    items: state.navigation.items,
    subitems: state.navigation.subitems,
    is_mobile: state.auth.is_mobile,
    subchhild: state.navigation.subchhild
  });
  
  const mapDispatchToProps = dispatch =>
    bindActionCreators(
      { 
        setSubitemsNavigation
      },
      dispatch
    );
  
  export default withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Submenu)
  );
