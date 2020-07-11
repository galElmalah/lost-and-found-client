import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { MarkersProvider } from "./providers/MapMarkersProvider";
import { BrowserRouter as Router, HashRouter } from "react-router-dom";
import { UserDetailsProvider } from "./providers/UserDetailsProvider/index";

import { DrawerProvider } from "./components/Drawer/index";
// '/' -> login page - if logged in then go to '/map'
// '/map' -> map component

ReactDOM.render(
  <HashRouter basename="/">
    <DrawerProvider>
      <UserDetailsProvider>
        <MarkersProvider>
          <App />
        </MarkersProvider>
      </UserDetailsProvider>
    </DrawerProvider>
  </HashRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
