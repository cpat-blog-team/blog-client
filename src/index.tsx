import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";
import "./index.scss";
import "./app.scss";
import { BrowserRouter } from 'react-router-dom';
import axios from "axios";
import userContext from "./userContext";

axios("/user")
  .then(({ data }) => {
    ReactDOM.render(
      <BrowserRouter>
        <userContext.Provider value={data}>
          <App />
        </userContext.Provider>
      </BrowserRouter>
      , document.getElementById("app")
    );
  })
