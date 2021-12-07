import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { configs } from "../../configs/static";
import Registration from "../../components/Widgets/Registration";
import { fetchHelper } from "./../../helpers/fetch_helper";

import Swal from "sweetalert2";
import { validator } from "./../../helpers/validator";
import $ from "jquery";
import "./style.scss";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Desktop from "./desktop";
import Mobile from "./mobile";

class Footer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  render() {
    return this.props.is_mobile ?  <Mobile /> : <Desktop />;
  }
}


const mapStateToProps = state => ({
  is_mobile: state.auth.is_mobile
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {

    },
    dispatch
  );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Footer)
);

