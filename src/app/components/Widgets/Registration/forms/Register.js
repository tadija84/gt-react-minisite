import React, { Component } from "react";
import { StateHelper } from "./../../../../helpers/state_helper";
import $ from "jquery";
import { validator } from "./../../../../helpers/validator";
import { fetchHelper } from "../../../../helpers/fetch_helper";

var register;
var veremail;
var parent;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      before: null,
      uid: null,
      phone: null,
      email: null,
      pwd: null,
      user: {
        personal: {
          type: 1,
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          birthday: "",
          address: "",
          postal_code: "",
          city: "",
          password: ""
        },
        business: {
          type: 2,
          company_name: "",
          contact_person: "",
          bank_account: "",
          tax_number: "",
          email: "",
          phone: "",
          mob_phone: "",
          fax: "",
          address: "",
          postal_code: "",
          city: "",
          password: ""
        }
      },
      isEmailVerified: "busy",
      isPhoneVerified: "notverified",
      verification_code: "",
      disable_sms: false
    };

    register = this;
  }

  componentDidMount(props) {
    //this.setState({value:this.props.value,isChecked:this.props.checked});

    $("body").addClass("noscroll");
  }

  componentWillUnmount() {}

  validateForm() {
    fetchHelper.last_fetch = null;
    var isValid = true;
    var inputs = $("body").find(".step.active input");
    if (inputs.length) {
      var data = this.state.user;
      $.each(inputs, function() {
        if (!validator.validate($(this))) isValid = false;
        else {
          var i = $(this);
          var name = i.attr("name");
          var value = i.val();

          switch (register.state.step) {
            case 2:
            case 4:
            case 6:
              data.personal[name] = value;
              break;
            case 3:
            case 5:
            case 7:
              data.business[name] = value;
              break;
          }
        }
      });
      register.setState({ user: data });
    }

    return isValid;
  }

  submitStep(next, prev, async) {
    fetchHelper.last_fetch = null;
    //this.setState({step:next, before:prev}); return true;

    validator.callback = e => {
      if ($("body").find(".step.active .form-group.error").length == 0)
        if (e) this.setState({ step: next, before: prev });
    };

    var isValid = this.validateForm();

    if (async == undefined || async == false) {
      if (isValid) {
        if ($("body").find(".step.active .form-group.error").length == 0)
          this.setState({ step: next, before: prev });
      }
    }
  }

  submit(data) {
    fetchHelper.last_fetch = null;
    this.props.parent.setState({ closeStatus: "hidden" });

    this.setState({ email: data.email, pwd: data.password });
    fetchHelper.last_fetch = null;
    StateHelper.REGISTER_USER(data, r => {
      if (r.status == false) {
        this.setState({ isEmailVerified: "notverified" });
        $("body")
          .find(".step.active .form-preview")
          .html(
            '<h5>Greška</h5><ul class="buletlist"><li>' +
              r.errors +
              "</li></ul>"
          );
      }

      if (r.status == true) {
        this.setState({
          uid: r.id,
          phone: data.type == 1 ? data.phone : data.mob_phone
        });

        fetchHelper.send_verification_phone(
          r.id,
          data.type == 1 ? data.phone : data.mob_phone,
          e => {
            if (e.status == false) {
              $("body")
                .find(".step.active .form-preview")
                .html(
                  '<h5>Greška</h5><ul class="buletlist"><li>SMS kod za verifikaciju nije poslat.</li></ul>'
                );
            } else {
              if (e.status == true && e.activated == true && e.id) {
                StateHelper.LOGIN_USER(this.state.email, this.state.pwd, a => {
                  if (a == true) {
                    this.props.parent.closeLogin();
                    global.window.location.href = global.window.location.href;
                  }
                });
              }
            }
          }
        );

        clearTimeout(veremail);

        if (r.id) {
          veremail = setInterval(() => {
            fetchHelper.last_fetch = null;
            fetchHelper.is_verified_email(r.id, e => {
              if (e.status == true) {
                clearTimeout(veremail);
                this.setState({ isEmailVerified: "verified" });

                StateHelper.LOGIN_USER(this.state.email, this.state.pwd, a => {
                  if (a == true) {
                    this.props.parent.closeLogin();
                    global.window.location.href = global.window.location.href;
                  }
                });
              }
            });
          }, 4000);
        }
      }
    });
  }

  handleSMSChange(event) {
    fetchHelper.last_fetch = null;
    var value = event.target.value;
    if (value.length == 4) {
      this.setState({ disable_sms: true });
      fetchHelper.verify_sms_code(value, this.state.phone, response => {
        if (response.status == true) {
          this.setState({ isPhoneVerified: "verified", uid: response.id });
          this.setState({ disable_sms: true });
        } else {
          this.setState({ disable_sms: false });
        }

        if (
          response.status == true &&
          response.activated == true &&
          response.id
        ) {
          StateHelper.LOGIN_USER(this.state.email, this.state.pwd, a => {
            if (a == true) {
              this.props.parent.closeLogin();
              global.window.location.href = global.window.location.href;
            }
          });
        }
      });
    }
  }

  render() {
    parent = this.props.parent;

    return (
      <div className="reg-form step-container full-height">
        <div
          className={
            "step " +
            (this.state.step == 1 ? "active" : "") +
            (this.state.before == 1 ? " inactive" : "")
          }
        >
          <div className="form-options form-buttons text-center">
            <button
              onClick={() => {
                this.setState({ step: 2, before: 1 });
                this.props.parent.setState({
                  title: "Registracija privatnog korisnika"
                });
              }}
            >
              <i className="fa fa-user" aria-hidden="true" /> Privatni korisnik
            </button>
            <button
              onClick={() => {
                this.setState({ step: 3, before: 1 });
                this.props.parent.setState({
                  title: "Registracija poslovnog korisnika"
                });
              }}
            >
              <i className="fa fa-users" aria-hidden="true" /> Poslovni korisnik
            </button>
          </div>
        </div>

        <div
          className={
            "step " +
            (this.state.step == 2 ? "active" : "") +
            (this.state.before == 2 ? " inactive" : "")
          }
        >
          <div className="row">
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>
                  Ime
                  <sup>*</sup>
                </label>
                <input
                  type="text"
                  name="firstname"
                  data-valid="isEmpty,isName,isMax"
                  data-max="20"
                  maxLength="50"
                />
                <span className="error isEmpty">Ime je obavezno polje.</span>
                <span className="error isName">Nesipravan unos!</span>
                <span className="error isMax">
                  Maksimalan broj kataktera je 20
                </span>
              </div>
            </div>
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>
                  Prezime
                  <sup>*</sup>
                </label>
                <input
                  type="text"
                  name="lastname"
                  data-valid="isEmpty,isName,isMax"
                  data-max="20"
                  maxLength="50"
                />
                <span className="error isEmpty">
                  Prezime je obavezno polje.
                </span>
                <span className="error isName">Nesipravan unos!</span>
                <span className="error isMax">
                  Maksimalan broj kataktera je 20
                </span>
              </div>
            </div>
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>
                  Email
                  <sup>*</sup>
                </label>
                <input
                  type="email"
                  name="email"
                  data-valid="isEmpty,isEmail,isMin,isMax,isExist"
                  data-max="80"
                  maxLength="80"
                  data-min="10"
                  data-route="core/user/check_email"
                />
                <span className="error isEmpty">Email je obavezno polje.</span>
                <span className="error isEmail">Nesipravan unos!</span>
                <span className="error isMin">
                  Minimalan broj karatktera je 10
                </span>
                <span className="error isMax">
                  Maksimalan broj kataktera je 80
                </span>
                <span className="error isExist">
                  Email adresa je već registrovana u sistemu.
                </span>
              </div>
            </div>
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>
                  Mob. Telefon
                  <sup>*</sup>
                </label>
                <input
                  type="text"
                  name="phone"
                  data-valid="isEmpty,isPhone"
                  data-max="17"
                  maxLength="17"
                />
                <span className="error isEmpty">
                  Telefon je obavezno polje.
                </span>
                <span className="error isPhone">Nesipravan unos!</span>
              </div>
            </div>
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>Datum rođenja</label>
                <input name="birthday" className="birthday" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              <div className="form-buttons">
                <button
                  className="back-btn"
                  onClick={() => this.setState({ step: 1, before: null })}
                >
                  <i className="fa fa-angle-left" /> Nazad
                </button>
                <button onClick={() => this.submitStep(4, 2, true)}>
                  Dalje <i className="fa fa-angle-right" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            "step " +
            (this.state.step == 3 ? "active" : "") +
            (this.state.before == 3 ? " inactive" : "")
          }
        >
          <div className="row">
            <div className="col col-12 col-pad">
              <div className="form-group">
                <label>Naziv firme / kompanije</label>
                <input
                  type="text"
                  name="company_name"
                  data-valid="isEmpty,isAddress,isMax"
                  data-max="200"
                  maxLength="250"
                />
                <span className="error isEmpty">
                  Ime kompanije je obavezno polje.
                </span>
                <span className="error isAddress">Nesipravan unos!</span>
                <span className="error isMax">
                  Maksimalan broj karaktera je 200!
                </span>
              </div>
            </div>
            <div className="col col-12 col-pad">
              <div className="form-group">
                <label>Odgovorno lice</label>
                <input
                  type="text"
                  name="contact_person"
                  data-valid="isEmpty,isName,isMax"
                  data-max="40"
                  maxLength="50"
                />
                <span className="error isEmpty">Ime je obavezno polje.</span>
                <span className="error isName">Nesipravan unos!</span>
                <span className="error isMax">
                  Maksimalan broj kataktera je 40
                </span>
              </div>
            </div>
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>Žiro račun</label>
                <input
                  type="text"
                  name="bank_account"
                  data-valid="isEmpty,isBank,isMax"
                  data-max="30"
                  maxLength="50"
                />
                <span className="error isEmpty">
                  Broj računa je obavezno polje.
                </span>
                <span className="error isBank">Nesipravan unos!</span>
                <span className="error isMax">
                  Maksimalan broj kataktera je 30
                </span>
              </div>
            </div>
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>PIB</label>
                <input
                  type="text"
                  name="tax_number"
                  data-valid="isEmpty,isNumber,isMax"
                  data-max="20"
                  maxLength="50"
                />
                <span className="error isEmpty">PIB je obavezno polje.</span>
                <span className="error isNumber">Nesipravan unos!</span>
                <span className="error isMax">
                  Maksimalan broj kataktera je 20
                </span>
              </div>
            </div>
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  data-valid="isEmpty,isEmail,isExist,isMax"
                  data-max="80"
                  maxLength="100"
                  data-route="core/user/check_email"
                />
                <span className="error isEmpty">Email je obavezno polje.</span>
                <span className="error isEmail">Nesipravan unos!</span>
                <span className="error isMax">
                  Maksimalan broj kataktera je 80
                </span>
                <span className="error isExist">
                  Email adresa je već registrovana u sistemu.
                </span>
              </div>
            </div>
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>Telefon</label>
                <input
                  type="text"
                  name="phone"
                  data-valid="isEmpty,isPhone,isMax"
                  data-max="17"
                  maxLength="20"
                />
                <span className="error isEmpty">
                  Telefon je obavezno polje.
                </span>
                <span className="error isPhone">Nesipravan unos!</span>
                <span className="error isMax">
                  Maksimalan broj kataktera je 17
                </span>
              </div>
            </div>
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>Mob. Telefon</label>
                <input
                  type="text"
                  name="mob_phone"
                  data-valid="isEmpty,isPhone,isMax"
                  data-max="17"
                  maxLength="20"
                />
                <span className="error isEmpty">
                  Telefon je obavezno polje.
                </span>
                <span className="error isPhone">Nesipravan unos!</span>
                <span className="error isMax">
                  Maksimalan broj kataktera je 17
                </span>
              </div>
            </div>
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>FAX</label>
                <input type="text" name="fax" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              <div className="form-buttons">
                <button
                  className="back-btn"
                  onClick={() => this.setState({ step: 1, before: null })}
                >
                  <i className="fa fa-angle-left" /> Nazad
                </button>
                <button onClick={() => this.submitStep(5, 3, true)}>
                  Dalje <i className="fa fa-angle-right" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            "step " +
            (this.state.step == 4 ? "active" : "") +
            (this.state.before == 4 ? " inactive" : "")
          }
        >
          <div className="row">
            <div className="col col-12 col-pad">
              <div className="form-group">
                <label>Adresa</label>
                <input
                  type="text"
                  name="address"
                  data-valid="isEmpty,isAddress,isMax"
                  data-max="200"
                  maxLength="250"
                />
                <span className="error isEmpty">Adresa je obavezno polje.</span>
                <span className="error isAddress">Nesipravan unos!</span>
                <span className="error isMax">
                  Maksimalan broj kataktera je 200
                </span>
              </div>
            </div>
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>Poštanski broj</label>
                <input
                  type="text"
                  name="postal_code"
                  placeholder="11000"
                  data-valid="isEmpty,isNumber,isMax"
                  data-max="5"
                  maxLength="5"
                />
                <span className="error isEmpty">
                  Poštanski broj je obavezno polje.
                </span>
                <span className="error isNumber">Nesipravan unos!</span>
                <span className="error isMax">
                  Maksimalan broj kataktera je 5
                </span>
              </div>
            </div>
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>Grad / Mesto</label>
                <input
                  type="text"
                  name="city"
                  data-valid="isEmpty,isName,isMax"
                  data-max="40"
                  maxLength="50"
                />
                <span className="error isEmpty">
                  Grad/mesto je obavezno polje.
                </span>
                <span className="error isName">Nesipravan unos!</span>
                <span className="error isMax">
                  Maksimalan broj kataktera je 40
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              <div className="form-buttons">
                <button
                  className="back-btn"
                  onClick={() => this.setState({ step: 2, before: 1 })}
                >
                  <i className="fa fa-angle-left" /> Nazad
                </button>
                <button onClick={() => this.submitStep(6, 4, false)}>
                  Dalje <i className="fa fa-angle-right" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            "step " +
            (this.state.step == 5 ? "active" : "") +
            (this.state.before == 5 ? " inactive" : "")
          }
        >
          <div className="row">
            <div className="col col-12 col-pad">
              <div className="form-group">
                <label>Adresa</label>
                <input type="text" name="address" />
              </div>
            </div>
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>Poštanski broj</label>
                <input type="text" name="postal_code" placeholder="11000" />
              </div>
            </div>
            <div className="col col-6 col-pad">
              <div className="form-group">
                <label>Grad / Mesto</label>
                <input type="text" name="city" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              <div className="form-buttons">
                <button
                  className="back-btn"
                  onClick={() => this.setState({ step: 3, before: 1 })}
                >
                  <i className="fa fa-angle-left" /> Nazad
                </button>
                <button onClick={() => this.submitStep(7, 5, false)}>
                  Dalje <i className="fa fa-angle-right" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            "step " +
            (this.state.step == 6 ? "active" : "") +
            (this.state.before == 6 ? " inactive" : "")
          }
        >
          <div className="row">
            <div className="col col-12 col-pad">
              <div className="form-group">
                <label>Lozinka</label>
                <input type="password" name="password" id="pwd1" />
              </div>
            </div>
            <div className="col col-12 col-pad">
              <div className="form-group">
                <label>Ponovi lozinku</label>
                <input
                  type="password"
                  name="repeat_password"
                  data-valid="isEmpty,isEqual,isMax"
                  data-eq="#pwd1"
                  data-max="40"
                  maxLength="50"
                />
                <span className="error isEmpty">
                  Lozinka je obavezno polje.
                </span>
                <span className="error isEqual">Lozinke nisu iste!</span>
                <span className="error isMax">
                  Maksimalan broj kataktera je 40
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              <div className="form-buttons">
                <button
                  className="back-btn"
                  onClick={() => this.setState({ step: 4, before: 2 })}
                >
                  <i className="fa fa-angle-left" /> Nazad
                </button>
                <button onClick={() => this.submitStep(8, 6, false)}>
                  Dalje <i className="fa fa-angle-right" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            "step " +
            (this.state.step == 7 ? "active" : "") +
            (this.state.before == 7 ? " inactive" : "")
          }
        >
          <div className="row">
            <div className="col col-12 col-pad">
              <div className="form-group">
                <label>Lozinka</label>
                <input type="password" name="password" id="pwd2" />
              </div>
            </div>
            <div className="col col-12 col-pad">
              <div className="form-group">
                <label>Ponovi lozinku</label>
                <input
                  type="password"
                  name="repeat_paassword"
                  data-valid="isEmpty,isEqual,isMax"
                  data-eq="#pwd2"
                  data-max="40"
                  maxLength="50"
                />
                <span className="error isEmpty">
                  Lozinka je obavezno polje.
                </span>
                <span className="error isEqual">Lozinke nisu iste!</span>
                <span className="error isMax">
                  Maksimalan broj kataktera je 40
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              <div className="form-buttons">
                <button
                  className="back-btn"
                  onClick={() => this.setState({ step: 5, before: 3 })}
                >
                  <i className="fa fa-angle-left" /> Nazad
                </button>
                <button onClick={() => this.submitStep(9, 7, false)}>
                  Dalje <i className="fa fa-angle-right" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            "step " +
            (this.state.step == 8 ? "active" : "") +
            (this.state.before == 8 ? " inactive" : "")
          }
        >
          <div className="row">
            <div className="col col-12 col-pad">
              <div className="form-preview">
                <h5>Pregled podataka</h5>
                <p>
                  Molimo vas da pregledate unete podatke pre nego što potvrdite
                  završetak registracije.
                </p>
                <ul>
                  <li>
                    <span>Ime:</span>
                    {this.state.user.personal.firstname}{" "}
                    {this.state.user.personal.lastname}
                  </li>
                  <li>
                    <span>Adresa:</span>
                    {this.state.user.personal.address}
                  </li>
                  <li>
                    <span>Pošt. broj:</span>
                    {this.state.user.personal.postal_code}
                  </li>
                  <li>
                    <span>Grad/mesto:</span>
                    {this.state.user.personal.city}
                  </li>
                  <li>
                    <span>Telefon:</span>
                    {this.state.user.personal.phone}
                  </li>
                  <li>
                    <span>Email:</span>
                    {this.state.user.personal.email}
                  </li>
                  <li>
                    <span>Datum rođ.:</span>
                    {this.state.user.personal.birthday}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              <div className="form-buttons">
                <button
                  className="back-btn"
                  onClick={() => this.setState({ step: 6, before: 4 })}
                >
                  <i className="fa fa-angle-left" /> Nazad
                </button>
                <button
                  className="final-form-btn"
                  onClick={() => {
                    this.setState({ step: 10, before: 8 });
                    this.submit(this.state.user.personal);
                  }}
                >
                  Završi registraciju
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            "step " +
            (this.state.step == 9 ? "active" : "") +
            (this.state.before == 9 ? " inactive" : "")
          }
        >
          <div className="row">
            <div className="col col-12 col-pad">
              <div className="form-preview">
                <h5>Pregled podataka</h5>
                <p>
                  Molimo vas da pregledate unete podatke pre nego što potvrdite
                  završetak registracije.
                </p>
                <ul>
                  <li>
                    <span>Kompanija:</span>
                    {this.state.user.business.company_name}
                  </li>
                  <li>
                    <span>Odg. lice:</span>
                    {this.state.user.business.contact_person}
                  </li>
                  <li>
                    <span>Adresa:</span>
                    {this.state.user.business.address}
                  </li>
                  <li>
                    <span>Pošt. broj:</span>
                    {this.state.user.business.postal_code}
                  </li>
                  <li>
                    <span>Grad/mesto:</span>
                    {this.state.user.business.city}
                  </li>
                  <li>
                    <span>Žiro račun:</span>
                    {this.state.user.business.bank_account}
                  </li>
                  <li>
                    <span>PIB:</span>
                    {this.state.user.business.tax_number}
                  </li>
                  <li>
                    <span>Telefon:</span>
                    {this.state.user.business.phone}
                  </li>
                  <li>
                    <span>Email:</span>
                    {this.state.user.business.email}
                  </li>
                  <li>
                    <span>FAX:</span>
                    {this.state.user.business.fax}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              <div className="form-buttons">
                <button
                  className="back-btn"
                  onClick={() => this.setState({ step: 7, before: 5 })}
                >
                  <i className="fa fa-angle-left" /> Nazad
                </button>
                <button
                  className="final-form-btn"
                  onClick={() => {
                    this.setState({ step: 10, before: 9 });
                    this.submit(this.state.user.business);
                  }}
                >
                  Završi registraciju
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={"step " + (this.state.step == 10 ? "active" : "")}>
          <div className="row">
            <div className="col col-12 col-pad">
              <div className="form-preview">
                <h5>Molimo sačekajte verifikaciju</h5>
                <ul className="buletlist">
                  <li>
                    Na vašu email adresu je poslat verifikacioni mail u kojem se
                    nalazi link za verifikaciju. Molimo proverite vaše poštasnko
                    sanduče i kliknite na link iz mejla.
                  </li>
                  <li>
                    Na vaš broj telefona je poslat verifikacioni sms. Molimo vas
                    da po prijemu koda unesete isti u polje ispod.
                  </li>
                </ul>
              </div>
              <div className="verification-status clear">
                Verifikacija e-mail adrese{" "}
                <span className={this.state.isEmailVerified} />
              </div>
              <div className="verification-status clear">
                Verifikacija broja telefona{" "}
                <span className={this.state.isPhoneVerified} />
              </div>

              <div className="verification-code">
                <input
                  disabled={this.state.disable_sms ? "disabled" : ""}
                  defaultValue={this.state.verification_code}
                  placeholder="Unesite verifikacioni kod"
                  onChange={event => this.handleSMSChange(event)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
