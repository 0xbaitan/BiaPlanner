import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import { VERSION } from "@biaplanner/shared";
import Routes from "./Routes";
function App() {
  console.log(VERSION);
  return <Routes />;
}

export default App;
