import React, { Component } from "react";

export class TabPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  content() {
    return <div>{this.props.p.props.children}</div>;
  }

  render() {
    return (
      <div
        className={
          "tab-panel" +
          (this.props.activeTab === this.props.index ? " active" : "")
        }
      >
        {this.content()}
      </div>
    );
  }
}

export class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.clickTab = this.clickTab.bind(this);
  }

  componentDidMount() {}

  clickTab() {
    this.props.parent.setState({ activeTab: this.props.index });
  }

  render() {
    const { title, ...props } = this.props;

    return (
      <div
        className={
          this.props.activeTab === this.props.index ? "active tab" : "tab"
        }
        onClick={() => {
          this.clickTab();
        }}
      >
        {title}
      </div>
    );
  }
}

export class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }

  componentDidMount() {}

  childrens(childrens) {
    var n = -1;
    return childrens.map((tab, i) => {
      if (typeof tab.props.children === "string") {
        n++;
        return (
          <Tab
            title={tab.props.children}
            key={i}
            activeTab={this.state.activeTab}
            index={i}
            parent={this}
          />
        );
      }
    });
  }

  tabs(childrens) {
    var n = -1;

    return childrens.map((tab, i) => {
      if (typeof tab.props.children !== "string") {
        n++;
        return (
          <TabPanel
            key={i}
            p={tab}
            activeTab={this.state.activeTab}
            index={n}
          />
        );
      }
    });
  }

  render() {
    const { children, ...props } = this.props;

    return (
      <div className="tabs xtabs">
        <div className="tabs-holder">{this.childrens(this.props.children)}</div>
        <div className="tabs-panel-holder">
          {this.tabs(this.props.children)}
        </div>
      </div>
    );
  }
}
