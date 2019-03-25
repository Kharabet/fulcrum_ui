import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { AppRoot } from "./components/AppRoot";

import "./styles/index.scss";

Modal.setAppElement("#root");

ReactDOM.render(<AppRoot />, document.getElementById("root"));
