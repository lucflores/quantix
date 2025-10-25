import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import "./styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";

// 👇 agrega esto
import { setAuthToken } from "./core/api/client";

const token = localStorage.getItem("token");
if (token) setAuthToken(token);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
