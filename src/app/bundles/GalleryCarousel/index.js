import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Slider from "react-slick";
import { fetchHelper } from "../../helpers/fetch_helper";
import Item from "../../routes/ProductCatalog/components/ProductGrid/item";

import $ from "jquery";
import { throws } from "assert";

class GalleryCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null
    };
  }
  componentDidMount() {
    this.setState({ items: this.props.items });
  }

  componentWillReceiveProps() {}

  products() {
    var _t = this;
    var n = 0;

    if (!this.state.items) return "";

    return Object.keys(this.state.items).map((e, i) => (
        <div className="item" key={i}>
          <img src={this.state.items[e]} />
        </div>
      )
    );
  }

  render() {
    const settings = {
      dots: this.props.dots ? this.props.dots : false,
      infinite: false,
      speed: 500,
      arrows:
        this.props.arrows !== undefined
          ? this.props.arrows
            ? true
            : false
          : false,
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: false,
      centerMode: false,
      
    };

    return (
      <div className="product-carousel">
        <Slider ref="slick" {...settings}>
          {this.products()}
        </Slider>
      </div>
    );
  }
}

export default withRouter(GalleryCarousel);
