import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import AuthenticatedRoute from "../components/authenticated-route";
import UnauthenticatedRoute from "../components/unauthenticated-route";
import Loadable from "react-loadable";

import NotFound from "./not-found";


const Homepage = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./homepage"),
  loading: () => null,
  modules: ["homepage"]
});

const Razer = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./razer"),
  loading: () => null,
  modules: ["razer"]
});
const Laptop = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./proizvodi/laptoptovi"),
  loading: () => null,
  modules: ["razer"]
});


export default () => (
  <Switch>

    <Route exact path="/" component={Homepage} />

    <Route exact path="/razer" component={Razer} />

    <Route exact path="/proizvodi/laptopovi" component={Laptop} />

  
    <Route component={NotFound} />
  </Switch>
);
