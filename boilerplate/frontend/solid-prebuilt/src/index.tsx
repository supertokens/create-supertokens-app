/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "./index.css";
import App from "./App";
import { Auth } from "./Auth";
import { initSuperTokensWebJS } from "./config";

initSuperTokensWebJS();

const root = document.getElementById("root");

render(
    () => (
        <Router>
            <Route path="/auth/*" component={Auth} />
            <Route path="/" component={App} />
        </Router>
    ),
    root!
);
