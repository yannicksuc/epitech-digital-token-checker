import React from "react";
import ReactDOM from "react-dom";
import './custom.scss';
import "./styles/index.css";
import Main from "./Main.jsx";
import { PublicClientApplication } from "@azure/msal-browser";

/**
 * We recommend wrapping most or all of your components in the MsalProvider component. It's best to render the MsalProvider as close to the root as possible.
 */
ReactDOM.render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>,
    document.getElementById("root")
);