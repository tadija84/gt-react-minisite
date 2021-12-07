import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Link,
  Route,
  withRouter
} from "react-router-dom";
import { fetchHelper } from "./../../helpers/fetch_helper";
import { slugify } from "./../../helpers/url_helper";

import $ from "jquery";

import "./style.css";
import { StateHelper } from "../../helpers/state_helper";

import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";

class MenuComponent extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  html() {
    if (!this.props.components) return "";
    return this.props.components.map((component, i) => {
      if (component.type == this.props.type) {
        return (
          <div key={"d-" + i} className={"col col-" + this.props.col}>
            {component.link ? (
              <div
                className={"menu-component mc-" + this.props.type}
                style={{ backgroundImage: `url(${component.img})` }}
                to={component.link}
              >
                {component.items.length ? (
                    <ul>
                      <li>
                        <ul>
                          {component.items.map((item, a) => {
                            return (
                                <li key={"a-" + a}>
                                  <Link to={item.link}>
                                    {ReactHtmlParser(item.name)}
                                  </Link>
                                </li>
                            );
                          })}
                        </ul>
                      </li>
                    </ul>
                ) : (
                    ""
                )}

                <h3>{component.name}</h3>
              </div>

            ) : (
              <div
                className={"menu-component mc-" + this.props.type}
                style={{ backgroundImage: `url(${component.img})` }}
              >
                {component.items.length ? (
                  <ul>
                    <li>
                      <ul>
                        {component.items.map((item, a) => {
                          return (
                            <li key={"a-" + a}>
                              <Link to={item.link}>
                                {ReactHtmlParser(item.name)}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  </ul>
                ) : (
                  ""
                )}
                <h3>{component.name}</h3>
              </div>
            )}
          </div>
        );
      }
    });
  }

  render() {
    return <div className="menu-components clear row">{this.html()}</div>;
  }
}

export default withRouter(MenuComponent);
