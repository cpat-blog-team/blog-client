import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";
import "./index.scss";
import "./app.scss"
import { BrowserRouter } from 'react-router-dom';

var mountNode = document.getElementById("app");
ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, mountNode);
