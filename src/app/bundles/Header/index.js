import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";

import MobileHeader from "./mobile_index";
import DesktopHeader from "./desktop_index";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {

    if(this.props.is_mobile){
        return <MobileHeader />
    } else {
        return <DesktopHeader />
    }
  }
}


const mapStateToProps = state => ({
    is_mobile: state.auth.is_mobile
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ 

   }, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
