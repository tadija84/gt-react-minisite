import React , {Component} from "react";
import Page from "../../components/page";
import Slider from "react-slick";
import logo from "../../assets/logo.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"


export default class SimpleSlider extends Component {

  constructor(props){
    super(props);
    this.state = {

    }
  }

    render() {
      const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };
     
      return (
        <div>
          <Slider {...settings} className="sliderRazer">
            <div>
            <div>
      
        <hr />
        
      </div>
             <img src="https://d4kkpd69xt9l7.cloudfront.net/sys-master/root/he7/h88/8905638281246/5f0c8aa02585a9e48b300f74fedce8b7-Razer-Cynosa-Chroma-gallery-05.jpg" alt="sdas"></img>
             </div>

            <div>
            <img src="https://d4kkpd69xt9l7.cloudfront.net/sys-master/root/ha1/h7d/8909576863774/Razer_Naga_Trinity_07.jpg" alt=""></img>
            </div>
            <div>
            <img src="https://media.wired.com/photos/5bc67212a8af293117556237/master/pass/razerblade.jpg" alt=""></img>
            </div>
            <div>
            <img src="https://cdn-images-1.medium.com/max/1200/1*q-gIz7Wkg9NMvPq3UVHJQA.jpeg" alt=""></img>
            </div>
            <div>
            <img src="https://www.stuff.tv/sites/stuff.tv/files/brands/Razer/Huntsman_Elite_MY_2018/razer-huntsman-elite-gallery04.jpg" alt=""></img>
            </div>
            <div>
            <img src="https://cdn.wccftech.com/wp-content/uploads/2017/10/Razer-logo.jpg" alt=""></img>
            </div>
          </Slider>
        </div>
      );
    }
  }