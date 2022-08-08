import React from "react";
import ReactDOM from "react-dom";
import Chart from "./Chart";
import StockInfo from "./StockInfo";

import "../../../node_modules/react-vis/dist/style.css";

function Stock() {
  return (
    <div className="main">
      <h2>Stan magazynu</h2>
      <Chart />
      <div style={{position: 'absolute', top: '148px', right: '150px'}}>
        <StockInfo/>
      </div>
    </div>
  );
}


export default Stock