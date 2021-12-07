import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { configs } from "../../configs/static";

class SearchBox extends Component {
  constructor(props) {
    super();

    this.state = {
      data: [],
      value: props.value,
      loading: false
    };
  }

  /**
   * KeyDown Event
   *
   */
  onKeyUpHandler(e) {
    var _value = e.target.value;

    this.setState({ value: _value });

    if (_value) {
      this.loadData(_value);
    }
  }

  /**
   * Load data form API
   *
   */
  loadData(_value) {
    this.setState({
      loading: true
    });

    try {
      fetch(configs.api_url + "product/" + _value)
        .then(res => res.json())
        .then(data => {
          this.setState({
            data: data.items,
            loading: false
          });
        });
    } catch (error) {}
  }

  /**
   * Change input class on loading data
   *
   */
  setBusyStatus() {
    return this.state.loading ? "busy" : "normal";
  }

  render() {
    return (
      <div className="searchbox-container clear" id="searchBOX">
        <div className="search__component">
          <input
            onKeyUp={this.onKeyUpHandler.bind(this)}
            placeholder="Search for a string..."
            className={this.setBusyStatus()}
          />
        </div>
        <div className="search_icon">
          <i className="fa fa-search" aria-hidden="true" />
        </div>
      </div>
    );
  }
}

export default withRouter(SearchBox);
