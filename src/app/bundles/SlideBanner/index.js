import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { configs } from "../../configs/static";
import Slider from "react-slick";
import { fetchHelper } from "../../helpers/fetch_helper";
import "./index.css";
import $ from "jquery";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

let dragging = false;

class SlideBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slides: null
    };

    this.thumbClick = this.thumbClick.bind(this);
  }
  componentDidMount() {
    var category_id = 1;
    if (this.props.category_id) {
      category_id = this.props.category_id;
    }
    var gaming = this.props.gaming ? this.props.gaming : null;
    fetchHelper.fetch_slideshow(category_id, gaming, r => {
      this.setState({ slides: r.slides });
    });
  }

  componentWillReceiveProps() {
    this.refs.slick.innerSlider.onWindowResized();
  }

  slideshow() {
    if (!this.state.slides) return "";
    return Object.keys(this.state.slides).map((c, i) => {
      var item = this.state.slides[i];

      if (item.app_id == 4) {
        return (
          <div key={i}>
            <Link to={item.link} onClick={e => dragging && e.preventDefault()}>
              <img src={item.img} />
            </Link>
          </div>
        );
      }
    });
  }
  slideshowMobile() {
    if (!this.state.slides) return "";
    return Object.keys(this.state.slides).map((c, i) => {
      var item = this.state.slides[i];
      if (item.app_id == 3) {
        return (
          <div key={i}>
            <img src={item.img_mobile} />
          </div>
        );
      }
    });
  }

  thumbClick(e) {
    var el = $(e.target);
    var indx = parseInt(el.data("indx")) + 1;
    var pags = el.closest(".homeslider").find(".slick-dots");
    if (pags.length) {
      var li = pags.find("li:nth-child(" + indx + ")");
      if (li.length) {
        li.find("button").trigger("click");
      }
    }
  }

  icons() {
    if (!this.state.slides) return "";
    return Object.keys(this.state.slides).map((c, i) => {
      var item = this.state.slides[i];

      return (
        <div
          key={"slide-icon-" + i}
          className="slider-icon col col-five"
          onClick={e => this.thumbClick(e)}
          data-indx={i}
        >
          <img src={item.img_icon} data-indx={i} />
          <div className="slide-icon-text" data-indx={i}>
            {item.icon_text}
          </div>
        </div>
      );
    });
  }

  render() {
    const settings = {
      dots: true,
      infinite: this.props.infinite !== undefined ? this.props.infinite : false,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode:
        this.props.centerMode !== undefined ? this.props.centerMode : false,
      centerPadding: "4%",
      beforeChange: () => (dragging = true),
      afterChange: () => (dragging = false),
      autoplay: this.props.autoplay !== undefined ? this.props.autoplay : false,
      speed: 800,
      fade: this.props.fade !== undefined ? this.props.fade : false,
      cssEase: this.props.fade !== undefined ? this.props.fade ? 'cubic-bezier(0.7, 0, 0.3, 1)' : '' : '',
      arrows:
      this.props.arrows !== undefined
        ? this.props.arrows
            ? this.props.arrows
            : false
        : false,
    };

    return (
      <div className="homeslider">
        <Slider ref="slick" {...settings}>
          {this.props.is_mobile ? this.slideshowMobile() : this.slideshow()}
        </Slider>
        {this.props.icon == true ? (
          <div className="slider-icons clear">
            <div className="theme-wrap clear">{this.icons()}</div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
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
  )(SlideBanner)
);
