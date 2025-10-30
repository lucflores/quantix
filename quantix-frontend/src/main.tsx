import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/components.css";


import { setAuthToken } from "./core/api/client";

const token = localStorage.getItem("token");
if (token) setAuthToken(token);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
