import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.scss";
import "reflect-metadata";

import store, { persistor } from "./store";

import App from "./App";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import setupLocatorUI from "@locator/runtime";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

if (process.env.NODE_ENV === "development") {
  setupLocatorUI();
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
