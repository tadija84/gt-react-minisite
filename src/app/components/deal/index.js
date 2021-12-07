import React, { Component } from "react";
import { withRouter } from "react-router";
import "./style.scss";
import { StateHelper } from "../../helpers/state_helper";
import Spinner from "../Spinner";

import ProductsCarousel from "./../../bundles/ProductsCarousel";

import Countdown, { formatTimeDelta } from "react-countdown-now";

import { DateHelper } from "../../helpers/date_helper";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class Deal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: null,
      error: false
    };

    this.renderer = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        // Render a completed state
        return "";
      } else {
        // Render a countdown
        return (
          <span>
            {DateHelper.zeroPad(hours)}:{DateHelper.zeroPad(minutes)}:
            {DateHelper.zeroPad(seconds)}
          </span>
        );
      }
    };
  }

  componentDidMount() {
    StateHelper.LOAD_DEALS(r => {
      if (r.status) {
        this.setState({ items: r.items, error: false });
      } else {
        this.setState({ error: true });
      }
    });
  }

  render() {
    if (!this.state.items) {
      return (
        <div className="center">
          <Spinner size="24" />
        </div>
      );
    }

    if (this.state.error) {
      return "";
    }

    return (
      <div className="deal">
        <div className="deal-header">Giga Deal</div>
        <div className="deal-timer">
          <Countdown
            date={Date.now() + DateHelper.toEndDaySeconds()}
            renderer={this.renderer}
            zeroPadTime={2}
          />
        </div>
        <div className="deal-products">
          <ProductsCarousel
            items={this.state.items}
            show={this.props.is_mobile?3:1}
            dots={1}
            arrows={0}
            image="medium" 

          />
        </div>
      </div>
    );
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
  )(Deal)
);
