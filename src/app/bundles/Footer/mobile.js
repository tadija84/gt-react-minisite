import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { configs } from "../../configs/static";
import Registration from "../../components/Widgets/Registration";
import { fetchHelper } from "./../../helpers/fetch_helper";

import Swal from "sweetalert2";
import { validator } from "./../../helpers/validator";


import { bindActionCreators } from "redux";
import { connect } from "react-redux";


import $ from "jquery";
import "./style.scss";

class Mobile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLogForm: false,
      tabIndx: 0,
      data: {
        email: ""
      }
    };

    this.openLogin = this.openLogin.bind(this);
    this.newsletterSend = this.newsletterSend.bind(this);
    this.tabSelect = this.tabSelect.bind(this);

  }

  openLogin(event) {
    event.preventDefault();
    this.setState({ showLogForm: true });
    return false;
  }

  closeLogin() {
    this.setState({ showLogForm: false });
  }

  registrationForm() {
    if (this.state.showLogForm) return <Registration parent={this} />;
  }

  validateEmail() {
    fetchHelper.last_fetch = null;
    var isValid = true;
    var inputs = $("body").find(".newsletter input");
    if (inputs.length) {
      var data = this.state.data;
      $.each(inputs, function() {
        if (!validator.validate($(this))) isValid = false;
        else {
          var i = $(this);
          var name = i.attr("name");
          var value = i.val();
          data[name] = value;
        }
      });
    }
    return isValid;
  }
  newsletterSend() {
    var isValid = this.validateEmail();
    var data = JSON.stringify(this.state.data);
    if (isValid) {
      fetchHelper.newsletterAdd(data, response => {
        Swal.fire(
          "Obaveštenje",
          response.message,
          response.status === false ? "warning" : "success"
        );
      });
    } else {
      Swal.fire("Obaveštenje", "Email nije validan", "warning");
    }
  }


  tabSelect(indx){
        this.setState({tabIndx:indx});
  }


  render() {
    var currentYear = (new Date).getFullYear();

    return (
      <footer>
        {this.registrationForm()}
        <div className="mobile-footer">
            <ul className="clear">
                <li className={"footer-icon" + (this.state.tabIndx === 0 ? ' active':'')} onClick={()=>this.tabSelect(0)}>
                    <span className="user-icon"></span>
                </li>
                <li className={"footer-icon" + (this.state.tabIndx === 1 ? ' active':'')} onClick={()=>this.tabSelect(1)}>
                    <span className="sales-icon"></span>
                </li>
                <li className={"footer-icon" + (this.state.tabIndx === 2 ? ' active':'')} onClick={()=>this.tabSelect(2)}>
                    <span className="help-icon"></span>
                </li>
                <li className={"footer-icon" + (this.state.tabIndx === 3 ? ' active':'')} onClick={()=>this.tabSelect(3)}>
                    <span className="fast-icon"></span>
                </li>
                <li className={"footer-icon" + (this.state.tabIndx === 4 ? ' active':'')} onClick={()=>this.tabSelect(4)}>
                    <span className="buy-icon"></span>
                </li>
                <li className={"footer-icon" + (this.state.tabIndx === 5 ? ' active':'')} onClick={()=>this.tabSelect(5)}>
                    <span className="bussines-icon"></span>
                </li>
            </ul>
            <div className="foot-content">
                    <ul className={this.state.tabIndx === 0 ? 'active':''}>
                        <li><div className="foot-title">Korisnički nalog</div></li>
                        <li><Link to={"#"} onClick={event => this.openLogin(event)}>Već ste ulogovani? Ulogujte se sada</Link></li>
                        <li><Link to={"#"}>Zaboravljena lozinka</Link></li>
                        <li><Link to={"#"} onClick={event => this.openLogin(event)}>Registracija</Link></li>
                        <li><Link to={"#"} >Prijava za Newsletter</Link></li>
                    </ul>
                    <ul className={this.state.tabIndx === 1 ? 'active':''}>
                        <li><div className="foot-title">Prodaja</div></li>
                        <li><Link to="/promocije" >Aktuelna newsletter ponuda</Link></li>
                        <li><a href="https://issuu.com/gigatrons/docs">Aktuelni katalog</a></li>
                        <li><Link to="/akcije" >Akcije</Link></li>
                        <li><Link to="/novosti" >Novosti</Link></li>
                        <li><Link to="/gaming-korner" >Gaming korner</Link></li>
                    </ul>
                    <ul className={this.state.tabIndx === 2 ? 'active':''}>
                        <li><div className="foot-title">Potrebna vam je pomoć?</div></li>
                        <li><Link to="/uputstvo-za-narucivanje" >Kako kupovati na gigatron.rs</Link></li>
                        <li><Link to="/narucivanje-telefonom-ili-e-mailom">Naručivanje telefonom ili e-mailom</Link></li>
                        <li><Link to="/cesta-pitanja" >Česta pitanja</Link></li>
                        <li><Link to="/gigatron-bodovi" >Šta su gigatron bodovi?</Link></li>
                    </ul>
                    <ul className={this.state.tabIndx === 3 ? 'active':''}>
                        <li><div className="foot-title">Plaćanje i isporuka</div></li>
                        <li><Link to="/nacin-placanja" >Način plaćanja</Link></li>
                        <li><Link to="/sigurnost-prilikom-placanja">Sigurnost prilikom plaćanja</Link></li>
                        <li><Link to="/dostava" >Besplatna isporuka</Link></li>
                        <li><Link to="/tax-free" >TAX FREE i Ambasade</Link></li>
                    </ul>
                    <ul className={this.state.tabIndx === 4 ? 'active':''}>
                        <li><div className="foot-title">Kupovina</div></li>
                        <li><Link to="/gigatron-bodovi" >Gigatron loyalty kartica</Link></li>
                        <li><Link to="/politika-privatnosti">Politika privatnosti</Link></li>
                        <li><Link to="/detalji-ugovora-o-prodaji" >Detalji ugovora o prodaji</Link></li>
                        <li><Link to="/primedbe" >Reklamacije i prigovori</Link></li>
                        <li><Link to="/servis" >Servis</Link></li>
                        <li><Link to="/prodavnice" >Prodavnice</Link></li>
                    </ul>
                    <ul className={this.state.tabIndx === 5 ? 'active':''}>
                        <li><div className="foot-title">Kompanija Gigatron</div></li>
                        <li><Link to="/o-kompaniji-gigatron" >O Kompaniji Gigatron</Link></li>
                        <li><Link to="/karijera">Posao u Gigatronu</Link></li>
                        <li><Link to="/zakupljujemo-lokale" >Zakupljujemo lokale</Link></li>
                        <li><Link to="/company-profile" >Company profile</Link></li>
                        <li><Link to="/kontak" >Kontakt</Link></li>
                    </ul>
            </div>
        </div>
        {this.props.show_footer ? (
          <div>
            <div className="bottom-logos-wide-social">
              <h2>Pratite nas na društvenim mrežama</h2>
    
              <ul className="clear logo-wide">
                <li>
                  <a href="https://www.facebook.com/GigatronRS" target="_blank">
                    <span className="social facebook" ></span>
                  </a>
                </li>
                
                <li>
                  <a href="http://rs.linkedin.com/company/gigatron" target="_blank">
                    <span className="social linkedin" ></span>
                  </a>
                </li>
                
                <li>
                  <a href="https://www.youtube.com/user/GigatronChannel" target="_blank">
                  <span className="social youtube" ></span>
                  </a>
                </li>
                
                <li>
                  <a href="https://twitter.com/gigatronfanpage" target="_blank">
                  <span className="social twitter" ></span>
                  </a>
                </li>
                
                <li>
                  <a href="https://www.instagram.com/gigatron.rs/" target="_blank">
                    <span className="social instagram" ></span>
                  </a>
                </li>
              </ul>
            </div>
    
            <div className="button">
              <a href="/opt-out">Desktop verzija</a>
            </div>
    
            <ul className="visa-foot">
              <li>
                <a href="">
                  <span className="payicon maestro" ></span>
                </a>
              </li>
              <li>
                <a href="">
                <span className="payicon master" ></span>
                </a>
              </li>
              <li>
                <a href="">
                  <span className="payicon visa" ></span>
                </a>
              </li>
              <li>
                  <a href="http://www.visa.ca/verified/infopane/index.html" target="_blank">
                      <span className="payicon verified" ></span>
                  </a>
              </li>
              <li className="disclamer">
                  <p>Sve cene na ovom sajtu iskazane su u dinarima. PDV je uračunat u cenu. Gigatron maksimalno koristi sve svoje resurse da Vam svi artikli na ovom sajtu budu prikazani sa ispravnim nazivima specifikacija, fotografijama i cenama. Ipak, ne možemo garantovati da su sve navedene informacije i fotografije artikala na ovom sajtu u potpunosti ispravne.</p>
                  <p className="copy">Copyright © 2007-{currentYear} Gigatron. Sva prava zadržana.</p>
              </li>
            </ul>
          </div>
        ):('')}
        

      </footer>
    );
  }
}


const mapStateToProps = state => ({
  show_footer: state.catalog.show_footer,
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
  )(Mobile)
);
