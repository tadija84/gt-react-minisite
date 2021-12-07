import React, { Component } from "react";
import { StateHelper } from "./../../../../helpers/state_helper";
import { fetchHelper } from "./../../../../helpers/fetch_helper";
import { validator } from "./../../../../helpers/validator";
import $ from "jquery";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  loginUser,
  loginSMS,
  loginSocialUser,
  setError
} from "../../../../../modules/auth";
import Spinner from "./../../../../components/Spinner";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

const loginInProcess =
    "Validacija pristupnih parametara je u toku, molimo sačekajte...";
const loginError =
    "Korisnik nije pronadjen. Molimo da proverite unete parametre i pokušate ponovo.";
const loginSuccess =
    "Uspešno ste se ulogovali. Sada možete da nastavite kupovinu.";

var parent;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      forgoth_email: "",
      pwd: null,
      step: 1,
      before: null,
      isPinBusy: false,
      smsPinForm: false,
      disable_sms: false,
      verification_code: "",
      loginSpinner: true,
      loginMsg: loginInProcess,
      loginHasError: false,
      loginTrue: false,
      showForgoth: false,
      sendForgothStatus: false,
      sendForgothMessage: "Slanje zahteva je u toku.",
      sendForgothMessageStatus: false,
      showForgothBack: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSMSChange = this.handleSMS.bind(this);
    this.handlePwdChange = this.handlePwd.bind(this);
    this.showPinInput = false;
    this.responseFacebook = this.responseFacebook.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.forgoth = this.forgoth.bind(this);
    this.sendForgoth = this.sendForgoth.bind(this);
    this.handleForgothEmailChange = this.handleForgothEmailChange.bind(this);
  }

  responseFacebook(response) {
    if (response.userID !== undefined) {
      response.social = "fb";
      this.props.loginSocialUser(response);
      this.setState({
        step: 1,
        before: null,
        showForgoth: false,
        sendForgothStatus: false,
        sendForgothMessageStatus: false,
        loginWindow: false
      });
      setTimeout(() => {
        if (this.props.error_message === null) {
          this.props.parent.closeLogin();
        } else {
          setTimeout(() => {
            this.props.setError(null);
          }, 3000);
        }
      }, 1000);
    }
  }

  responseGoogle(response) {
    if (response.googleId !== undefined && !this.props.error_message) {
      response.social = "google";
      response.email = response.profileObj.email;
      response.name = response.profileObj.name;
      delete response.profileObj;
      this.props.loginSocialUser(response);

      setTimeout(() => {
        if (this.props.error_message === null) {
          this.props.parent.closeLogin();
        } else {
          setTimeout(() => {
            this.props.setError(null);
          }, 3000);
        }
      }, 1000);
    }
  }

  forgoth() {
    this.setState({
      showForgoth: this.state.showForgoth ? false : true,
      showForgothBack: false,
      sendForgothStatus: false
    });
  }

  componentDidMount(props) {
    //this.setState({value:this.props.value,isChecked:this.props.checked});

    $("body").addClass("noscroll");
  }

  componentWillUnmount() {}

  close() {
    this.props.parent.setState({ loginWindow: false });
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  handleForgothEmailChange(event) {
    this.setState({ forgoth_email: event.target.value });
  }

  handlePwd(event) {

    this.setState({ pwd: event.target.value });
  }

  handleSMS(event) {
    var value = event.target.value;

    if (value.length == 4 && this.state.username) {
      event.target.value = "";
      this.setState({ disable_sms: true, loginSpinner: true }, () => {
        fetchHelper.last_fetch = null;

        this.props.loginSMS(value, this.state.username).then(() => {
          if (this.props.currentUser) {

            console.log(this.props.currentUser);
            this.setState({
              disable_sms:true,
              loginTrue: true,
            });

            this.props.parent.closeLogin();

          } else {
            this.setState({disable_sms:false});

          }
        });
      });
    }
  }

  sendSMS() {
    fetchHelper.last_fetch = null;
    if (this.state.step == 2 && validator.isPhone(this.state.username)) {
      fetchHelper.send_verification_by_phone(this.state.username, e => {

        if (e.status == false) {
          $("body")
              .find("#response.pin")
              .html(
                  '<h5>Greška</h5><ul class="buletlist"><li>SMS kod za verifikaciju nije poslat.</li></ul>'
              );
          $("body")
              .find(".verification-code")
              .addClass("hide");
        } else {
          $("body")
              .find(".verification-code")
              .removeClass("hide");
        }

        $("body")
            .find(".spinner")
            .addClass("hide");
      });
    }
  }

  sendForgoth() {
    var e = this.state.forgoth_email;

    if (validator.isEmpty(e)) {
      this.setState({
        sendForgothStatus: true,
        sendForgothMessage: "Morate uneti e-mail adresu",
        showForgothBack: true,
        sendForgothMessageStatus: false
      });
      return;
    }

    if (!validator.isEmail(e)) {
      this.setState({
        sendForgothStatus: true,
        sendForgothMessage: "Uneta e-mail adresa nije ispravna",
        showForgothBack: true,
        sendForgothMessageStatus: false
      });
      return;
    }

    this.setState({ sendForgothStatus: true }, () => {
      StateHelper.FORGOTH_REQUEST(this.state.forgoth_email, response => {
        this.setState({
          sendForgothMessage: response.message,
          showForgothBack: true,
          sendForgothMessageStatus: response.status
        });
      });
    });
  }

  verifySMS() {}

  determineLoginOption() {
    if (this.state.step == 2)
      if (validator.isEmail(this.state.username)) {
        return (
            <div>
              <div className="form-group">
                <label>Lozinka</label>
                <input
                    type="password"
                    defaultValue={this.state.pwd}
                    onChange={this.handlePwdChange}

                />
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
                    <button
                        onClick={() => {

                          this.setState({ step: 3, before: 1 }, () => {
                            this.accountSubmit();
                          });
                        }}
                    >
                      <i className="fa fa-angle-right" aria-hidden="true" /> Dalje
                    </button>
                  </div>
                </div>
              </div>
            </div>
        );
      } else if (validator.isPhone(this.state.username)) {


        return (
            <div>
              <div className="form-preview">


                <h5>Molimo sačekajte verifikaciju</h5>
                <ul className="buletlist">
                  <li>
                    Na vaš broj telefona je poslat verifikacioni sms. Molimo vas
                    da po prijemu koda unesete isti u polje ispod.
                  </li>
                </ul>
              </div>
              <div id="response-pin" />
              <div className="verification-code hide">
                <input
                    disabled={this.state.disable_sms ? "disabled" : ""}
                    defaultValue={this.state.verification_code}
                    placeholder="Unesite verifikacioni kod"
                    onChange={this.handleSMSChange}
                />
              </div>

              <div className="text-center">
                <Spinner size="60" />
              </div>
            </div>
        );
      } else {
        return (
            <div>
              <p className="error-box full-width">
                Email ili broj telefona koji ste uneli nije ispravan!
              </p>
              <div className="form-buttons">
                <button
                    className="back-btn"
                    onClick={() =>
                        this.setState({ step: 1, before: null }, () => {
                          this.setState({ loginSpinner: true });
                        })
                    }
                >
                  <i className="fa fa-angle-left" /> Nazad
                </button>
              </div>
            </div>
        );
      }
  }

  accountSubmit() {

    if (validator.isEmail(this.state.username)   ) {

      fetchHelper.last_fetch = null;
      if (this.state.pwd && this.state.step == 3) {

        this.props.loginUser(this.state.username, this.state.pwd).then(() => {
          if (this.props.currentUser) {
            this.setState({
              loginMsg: loginSuccess,
              loginHasError: false,
              loginSpinner: false
            });

            setTimeout(() => {
              this.props.parent.closeLogin();
            }, 2000);
          } else {
            this.setState({
              loginMsg: loginError,
              loginHasError: true,
              loginSpinner: false
            });
          }
        });
      } else {
        this.setState({
          loginMsg: loginError,
          loginHasError: true,
          loginSpinner: false
        });
      }
    }
  }

  forgothForm() {
    return (
        <div className="reg-form step-container full-height noselect">
          <div className="active">
            <div className="form-group">
              <h3>Zaboravljena lozinka</h3>
              <input
                  type="text"
                  placeholder="Unesite vašu email adresu"
                  defaultValue={this.state.forgoth_email}
                  onChange={event => this.handleForgothEmailChange(event)}
              />
            </div>
            <div className="row">
              <div className="col col-12">
                <div className="form-buttons">
                  <button onClick={() => this.sendForgoth()}>
                    Zahtevaj lozinku{" "}
                    <i className="fa fa-angle-right" aria-hidden="true" />
                  </button>
                </div>
                <div className="back-to-login">
                <span onClick={() => this.forgoth()}>
                  <i className="fa fa-angle-left" /> Nazad na prijavu
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

  sendForgothWindow() {
    return (
        <div className="reg-form step-container full-height noselect">
          <div className="active">
            <div className="form-group">
              <h3 className="status-title">
                {this.state.showForgothBack ? (
                    this.state.sendForgothMessageStatus ? (
                        <i className="fa fa-check" />
                    ) : (
                        <i className="fa fa-warning" />
                    )
                ) : (
                    ""
                )}
                {this.state.sendForgothMessage}
              </h3>
              {this.state.showForgothBack ? (
                  <div className="back-to-login">
                <span onClick={() => this.forgoth()}>
                  <i className="fa fa-angle-left" /> Nazad na prijavu
                </span>
                  </div>
              ) : (
                  ""
              )}
            </div>
          </div>
        </div>
    );
  }

  loginForm() {
    return (
        <div className="reg-form step-container full-height noselect">
          {this.props.error_message ? (
              <div className="pop-error">{this.props.error_message}</div>
          ) : (
              ""
          )}
          <div
              className={
                "step " +
                (this.state.step == 1 ? "active" : "") +
                (this.state.before == 1 ? " inactive" : "")
              }
          >
            <div className="form-group">
              <label>Email / mobilni telefon</label>
              <input
                  type="text"
                  defaultValue={this.state.username}
                  onChange={this.handleChange}
              />
            </div>
            <div className="row">
              <div className="col col-12">
                <div className="form-buttons">
                  <button
                      onClick={() => {
                        this.setState({ step: 2, before: 1 }, () => {
                          this.sendSMS();
                        });
                      }}
                  >
                    <i className="fa fa-angle-right" aria-hidden="true" /> Dalje
                  </button>
                </div>
              </div>
              <div className="col col-12">
                <div className="social-login-title">
                  <span className="or-this">ili</span>
                  <div>Prijavite se koristeći naloge društvenih mreža:</div>
                </div>
                <div className="social-buttons">
                  <FacebookLogin
                      appId="290197081651857"
                      autoLoad={false}
                      fields="name,email,picture"
                      callback={this.responseFacebook}
                      cssClass="social-btn fb"
                      textButton="Facebook login"
                  />
                  <GoogleLogin
                      clientId="884670552858-n35f09aj0qs1jtssta95q0dmftocl13l.apps.googleusercontent.com"
                      buttonText="Google login"
                      onSuccess={this.responseGoogle}
                      onFailure={this.responseGoogle}
                      className="social-btn google"
                      autoLoad={false}
                  />
                </div>
              </div>
              <div className="col col-12">
                <div className="forgoth-btn" onClick={() => this.forgoth()}>
                  Zaboravili ste lozinku?
                </div>
              </div>
            </div>
          </div>
          <div
              className={
                "step " +
                (this.state.step == 2 ? "active" : "") +
                (this.state.before == 2 ? " inactive" : "")
              }
          >
            {this.determineLoginOption()}
          </div>
          <div
              className={
                "step " +
                (this.state.step == 3 ? "active" : "") +
                (this.state.before == 2 ? " inactive" : "")
              }
          >
            <h4>{this.state.loginMsg}</h4>
            {this.state.loginSpinner ? (
                <div className="text-center">
                  <Spinner size="60" />
                </div>
            ) : (
                <div>
                  {this.state.loginHasError ? (
                      <button
                          className="back-btn"
                          onClick={() =>
                              this.setState({ step: 1, before: null }, () => {
                                this.setState({ loginSpinner: false });
                              })
                          }
                      >
                        <i className="fa fa-angle-left" /> Pokušajte ponovo
                      </button>
                  ) : (
                      <div />
                  )}
                </div>
            )}
          </div>
        </div>
    );
  }

  render() {
    parent = this.props.parent;
    if (this.state.sendForgothStatus === false) {
      if (this.state.showForgoth === false) {
        return <div className="full-height">{this.loginForm()}</div>;
      } else {
        return <div className="full-height">{this.forgothForm()}</div>;
      }
    } else {
      return <div className="full-height">{this.sendForgothWindow()}</div>;
    }
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  error_message: state.auth.error_message
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ loginUser, loginSMS , loginSocialUser, setError }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
