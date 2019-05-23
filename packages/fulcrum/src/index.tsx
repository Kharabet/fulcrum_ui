import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { AppRouter } from "./components/AppRouter";

import "./styles/index.scss";

Modal.setAppElement("#root");

ReactDOM.render(<AppRouter />, document.getElementById("root"));
