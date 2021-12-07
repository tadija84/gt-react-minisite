import React from "react";
import { Link } from 'react-router-dom';
import Page from "../../components/page";
import "./style.css";
export default () => (
  <Page
    id="not-found"
    title="Stranica nije pronađena"
    description="Stranica nije pronađena."
    noCrawl
  >
    <div className="error404">
      <div className="c">
        <div className="_404">404</div>

        <div className="_1">STRANA</div>
        <div className="_2">NIJE PRONAĐENA</div>
        <Link className="btn" to="/">
          NAZAD NA POČETNU STRANU
        </Link>
      </div>
    </div>
  </Page>
);
