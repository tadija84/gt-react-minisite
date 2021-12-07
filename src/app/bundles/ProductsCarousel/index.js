import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Slider from "react-slick";
import { fetchHelper } from "../../helpers/fetch_helper";
import Item from "../../routes/ProductCatalog/components/ProductGrid/item";
import "./index.css";
import $ from "jquery";
import { throws } from "assert";

class ProductCarousel extends Component {
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

    return Object.keys(this.state.items).map((e, i) => {
      var product = this.state.items[e];
      return (
        <div key={i}>
          <Item product={product} image={this.props.image} />
        </div>
      );
    });
  }

  render() {
    const settings = {
      dots: this.props.dots ? true : false,
      infinite: false,
      speed: 500,
      arrows:
        this.props.arrows !== undefined
          ? this.props.arrows
            ? true
            : false
          : false,
      slidesToShow: this.props.show,
      slidesToScroll: this.props.show,
      variableWidth: false,
      centerMode: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false,
            dots: this.props.dots ? true : false
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            initialSlide: 3,
            infinite: false,
            dots: this.props.dots ? true : false
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            dots: this.props.dots ? true : false
          }
        },
        {
            breakpoint: 360,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              dots: this.props.dots ? true : false
            }
        },
        {
            breakpoint: 340,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              dots: this.props.dots ? true : false
            }
        },
        {
            breakpoint: 320,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: this.props.dots ? true : false
            }
        }
      ]
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

export default withRouter(ProductCarousel);
