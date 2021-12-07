import React, { Component } from "react";
import "./style.scss";
import { StateHelper } from "../../helpers/state_helper";
import Spinner from "../Spinner";
import { isMobile } from "react-device-detect";
import { fetchHelper } from "../../helpers/fetch_helper";
import { hashChangeListener, unbindHashChangeListener } from "../../helpers/url_helper";
import {
    Link,
    withRouter
  } from "react-router-dom";
import $ from 'jquery';
import ReactHtmlParser, {
    processNodes,
    convertNodeToElement,
    htmlparser2
  } from "react-html-parser";

class CategoryWidget extends Component {

  constructor(props) {
    super(props);

    this.state = {
        isLoading: false,
        items: [],
        opened:false,
        isLoaded: false,
        activeCategories: null,
    };

    this.loadCateogries = this.loadCategories.bind(this);
    this.categoryClick = this.categoryClick.bind(this);

  }

  componentWillUnmount(){
    unbindHashChangeListener();
  }

  componentDidMount() {

    unbindHashChangeListener();
    hashChangeListener((hash)=>{
        if(hash === '#kategorije' && !this.state.opened){
            this.loadCategories();
        }

        if(hash !== '#kategorije' && this.state.opened){
            this.setState({opened:false});
        }
    })

  }

  loadCategories(){
    if(!this.state.items.length){

        this.setState({isLoading:true}, ()=>{
            fetchHelper.fetchCategoryAll((r)=>{
                this.setState({isLoading:false, isLoaded: true, items:r.items});
                global.window.scrollTo(0, 0);
                setTimeout(() => {
                    this.setState({opened:true});
                }, 300);
                window.location.hash = 'kategorije';
            });
        });

    } else {
        if(this.state.isLoaded){
            setTimeout(() => {
                this.setState({opened:true});
            }, 300);
            global.window.scrollTo(0, 0);
            window.location.hash = 'kategorije';
        }
    }
  }


  groupsView(items){
        if( ! items.length ) return false;

        return (
            <div className="row">
                {items.map((item,key)=>(
                    <div className="col col-4" key={'group-'+key}>
                        {item.items.length ? (
                            <div className="group-item">
                                <figure>
                                    <img src={item.icon} />
                                </figure>
                                <h5>{item.name}</h5>
                            </div>
                        ):(
                            <Link to={item.url} className="group-item">
                                <figure>
                                    <img src={item.icon} />
                                </figure>
                                <h5>{item.name}</h5>
                            </Link>
                        )}
                        
                </div>
                ))}
                
            </div>
        );
  }


  categoryClick(categoryId){
     if(this.state.activeCategories === categoryId){
        this.setState({activeCategories:null});
     } else {
         this.setState({activeCategories:categoryId});
     }
  }

  view(){
      if(!this.state.items.length) return "";

      return this.state.items.map((item,key)=>{
        return (
            <div key={key} className={"category-widget-item"+(this.state.activeCategories === item.id ? " opened":"")}>
                <div className="row" onClick={()=>{this.categoryClick(item.id)}}>
                    <div className="col col-3">
                        <figure>
                            <img src={item.icon} />
                        </figure>
                    </div>
                    <div className="col col-9">
                        <h4>{item.name}</h4>
                        <p>{ReactHtmlParser(item.description)}</p>
                    </div>
                </div>
                <div className="groups-category-widget-items">
                    {this.groupsView(item.items)}
                </div>
            </div>
        )
      });
  }

  render() {
   
    if(! isMobile ) return ""; 

    if(this.state.isLoading) return (
        <div className="text-center" style={{paddingBottom: '20px',paddingTop: '10px'}}>
            <Spinner size={24} />
        </div>
        
    );

    return (
        <div className="category-widget">
            <button className="widget-btn" onClick={()=>this.loadCategories()} >Prikaži sve kategorije</button>

            <div className={"category-list"+(this.state.opened?' active':'')}>
                {this.view()}
            </div>

        </div>
    );
  }
}

export default withRouter(CategoryWidget);
