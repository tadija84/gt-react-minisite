import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { configs } from "../../configs/static";
import Registration from "../../components/Widgets/Registration";
import { fetchHelper } from "./../../helpers/fetch_helper";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Swal from "sweetalert2";
import { validator } from "./../../helpers/validator";
import $ from "jquery";
import "./style.scss";


class Desktop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLogForm: false,
      data: {
        email: ""
      }
    };

    this.openLogin = this.openLogin.bind(this);
    this.newsletterSend = this.newsletterSend.bind(this);
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
  render() {

    if(!this.props.show_footer) return "";

    return (
      <footer>
        {this.registrationForm()}
        <div className="footer-top">
          <div className="row">
            <div className="col col-6 col-lg-12">
              <div className="newsletter">
                <div className="form-group">
                  <label>Prijavite se za Newsletter</label>
                  <input
                    type="email"
                    placeholder="Upišite vašu e-mail adresu"
                    data-valid="isEmpty,isEmail,isMax"
                    data-max="80"
                    data-min="10"
                    name="email"
                  />
                  <button onClick={this.newsletterSend}>
                    <i className="fa fa-paper-plane-o" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <div className="col col-6 col-lg-12">
              <div className="social clear">
                <label>Pratite nas na društvenim mrežama</label>
                <Link to="">
                  <i className="fa fa-facebook" />
                </Link>
                <Link to="">
                  <i className="fa fa-twitter" />
                </Link>
                <Link to="">
                  <i className="fa fa-instagram" />
                </Link>
                <Link to="">
                  <i className="fa fa-youtube" />
                </Link>
                <Link to="">
                  <i className="fa fa-linkedin" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-central row">
          <div className="col col-9 footer-info">
            <div className="row">
              <div className="col col-2">
                <h5>Korisnički nalog</h5>
                <div className="footer-links">
                  <Link to={"#"} onClick={event => this.openLogin(event)}>
                    Već ste ulogovani? Ulogujte se sada
                  </Link>
                  <Link to={"#"}>Zaboravljena lozinka</Link>
                  <Link to={"#"} onClick={event => this.openLogin(event)}>Registracija</Link>
                </div>
              </div>
              <div className="col col-2">
                <h5>Prodaja</h5>
                <div className="footer-links">
                  <Link to={"/promocije"}>Aktuelna newsletter ponuda</Link>
                  <a href={"https://issuu.com/gigatrons/docs"} target="_blank">
                    Aktuelni katalog
                  </a>
                  <Link to={"/akcije"}>Akcije</Link>
                  <Link to={"/novosti"}>Novosti</Link>
                  <Link to={"/clanci/gaming-korner"}>Gaming korner</Link>
                </div>
              </div>
              <div className="col col-2">
                <h5>Potrebna vam je pomoć?</h5>
                <div className="footer-links">
                  <Link to={"/uputstvo-za-narucivanje"}>
                    Kako kupovati na gigatron.rs
                  </Link>
                  <Link to={"/narucivanje-telefonom-ili-e-mailom"}>
                    Naručivanje telefonom ili e-mailom
                  </Link>
                  <Link to={"/cesta-pitanja"}>Česta pitanja</Link>
                  <Link to={"/gigatron-bodovi"}>Šta su gigatron bodovi?</Link>
                </div>
              </div>
              <div className="col col-2">
                <h5>Plaćanje i isporuka</h5>
                <div className="footer-links">
                  <Link to={"/nacin-placanja"}>Način plaćanja</Link>
                  <Link to={"/sigurnost-prilikom-placanja"}>
                    Sigurnost prilikom plaćanja
                  </Link>
                  <Link to={"/dostava"}>Besplatna isporuka</Link>
                  <Link to={"/tax-free"}>TAX FREE i Ambasade</Link>
                </div>
              </div>
              <div className="col col-2">
                <h5>Kupovina</h5>
                <div className="footer-links">
                  <Link to={"/gigatron-bodovi"}>Gigatron loyalty kartica</Link>
                  <Link to={"/uslovi-koriscenja"}>Uslovi korišćenja</Link>
                  <Link to={"/politika-privatnosti"}>Politika privatnosti</Link>
                  <Link to={"/detalji-ugovora-o-prodaji"}>
                    Detalji ugovora o prodaji
                  </Link>
                  <Link to={"/primedbe"}>Reklamacije i prigovori</Link>
                  <Link to={"/servis"}>Servis</Link>
                  <Link to={"/prodavnice"}>Prodavnice</Link>
                </div>
              </div>
              <div className="col col-2">
                <h5>Kompanija Gigatron</h5>
                <div className="footer-links">
                  <Link to={"/o-kompaniji-gigatron"}>O Kompaniji Gigatron</Link>
                  <Link to={"/karijera"}>Posao u Gigatronu</Link>
                  <Link to={"/zakupljujemo-lokale"}>Zakupljujemo lokale</Link>
                  <Link to={"/company-profile"}>Company profile</Link>
                  <Link to={"/kontakt"}>Kontakt</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col col-3 separator-left call-center">
            <h5>Call Centar</h5>
            <div className="row contact-center">
              <div className="col col-6">
                <label>Fizička lica</label>
                <a href="tel:+38114414000">011 44 14 000</a>
              </div>
              <div className="col col-6">
                <label>Pravna lica</label>
                <a href="tel:+38114414010">011 44 14 010</a>
              </div>
              <div className="col col-6">
                <label>Pozivi sa mobilne mreže</label>
                <a href="tel:+381666676767">066 6 67 67 67</a>
              </div>
            </div>
          </div>
          <div className="col col-9 footer-promotions">
            <div className="footer-highlight">
              <div className="row">
                <div className="col col-3">
                  <h4>Besplatna isporuka</h4>
                  <Link to="/dostava">
                    Besplatna isporuka na teritoriji Srbije <br />
                    za sve iznose preko 3000 RSD
                  </Link>
                </div>
                <div className="col col-3">
                  <h4>Gigatron kartica</h4>
                  <Link to="/gigatron-bodovi">
                    Sakupljajte bodove i ostvarite <br />
                    dodatne popuste
                  </Link>
                </div>
                <div className="col col-3">
                  <h4>Šok cene i promocije</h4>
                  <Link to="/promocije">
                    Upoznajte se sa aktuelnim promocijama <br />i sniženjima
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col col-3 work-time">
            <div className="contact-center-work-time">
              <h5>Radno vreme Call Centra</h5>
              <p>
                Ponedeljak - Petak: od 08h do 20h
                <br />
                Subota: od 09h do 17h
                <br />
                Nedelja: neradni dan
              </p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="theme-wrap">
            <div className="cards">
              <a href="#">
                <img src={fetchHelper.resource_url + "/assets/img/layout/payment/visa_new.png"} />
              </a>
              <a href="#">
                <img src={fetchHelper.resource_url + "/assets/img/layout/payment/mastercard_new.png" }/>
              </a>
              <a href="#">
                <img src={fetchHelper.resource_url + "/assets/img/layout/payment/maestrocard_new.png" } />
              </a>
              <a href="#">
                <img src={fetchHelper.resource_url + "/assets/img/layout/payment/dina-card.png" } />
              </a>
              <a href="#">
                <img src={fetchHelper.resource_url + "/assets/img/layout/payment/logo-kombank.png"} />
              </a>
              <a href="#">
                <img src={fetchHelper.resource_url +"/assets/img/layout/payment/raiffeisen1.jpg"}/>
              </a>
              <a href="#">
                <img src={fetchHelper.resource_url + "/assets/img/layout/payment/wspay.png"} />
              </a>
              <a href="#">
                <img src={fetchHelper.resource_url + "/assets/img/layout/payment/verifiedbyvisa.jpg"}/>
              </a>
              <a href="#">
                <img src={fetchHelper.resource_url + "/assets/img/layout/payment/mastercard-securecode.png"}/>
              </a>
            </div>
            <p>
              Sve cene na ovom sajtu iskazane su u dinarima. PDV je uračunat u
              cenu. Gigatron maksimalno koristi sve svoje resurse da Vam svi
              artikli na ovom sajtu budu prikazani sa ispravnim nazivima
              specifikacija, fotografijama i cenama. Ipak, ne možemo garantovati
              da su sve navedene informacije i fotografije artikala na ovom
              sajtu u potpunosti ispravne
            </p>
            <div className="cards bigg">
              <a href="/trust/">
                <img src="https://verify.etrustmark.rs/cert/image.php" />
              </a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <div className="row">
            <div className="col col-6">
              <img src={fetchHelper.resource_url + "/assets/img/layout/new/logo-footer.png"} />{" "}
              Copyright © 2007-
              {new Date().getFullYear()} by Gigatron. Sva prava su zadržana.
            </div>
            <div className="col col-6 text-right">Developed by Gigatron</div>
          </div>
        </div>
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
  )(Desktop)
);
