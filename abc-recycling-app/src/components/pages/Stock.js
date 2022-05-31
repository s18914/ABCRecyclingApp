import React from "react";
import ReactDOM from "react-dom";
import Chart from "./Chart";

import "../../../node_modules/react-vis/dist/style.css";

function Stock() {
  return (
    <div className="main">
      <h2>Stan magazynu</h2>
      <Chart />
    </div>
  );
}


export default Stock