import React, { useState, useEffect } from "react";
import Axios from "../../request";

import {
  FlexibleXYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalBarSeries,
  LabelSeries,
  ChartLabel
} from "react-vis";

function Chart() {
  const [stockList, setStockList] = useState([]);

  useEffect(() => {
    Axios.get(`/getStock`).then(
      response => {
        setStockList(
          JSON.parse(JSON.stringify(response.data))
        );
      }
    )

    let r = 150;
    let g = 210;
    let b = 227;
    {stockList.map((type) => {
      let color = `rgb(${r}, ${g}, ${b})`; 
      if(r> 15) r -= 10;
      if(g> 15) g -= 15;
      if(b> 15) b -= 25;
      if(type.y !== undefined) type.label = type.y;
      type["color"] = color;
      type.y = parseFloat(type.y);
    })}
  }, []);

  

  return (
    <FlexibleXYPlot
        animation
        xType="ordinal"
        height={700}
        xDistance={100}
        yDomain={[-1, 3000]}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis
          style={{
            line: { stroke: "black" },
            text: { stroke: "none", fill: "black", fontWeight: 600 }
          }}
        />
        <YAxis tickFormat={(v) => (<tspan className="unselectable"> {v} </tspan>)} />
        <ChartLabel
          text=""
          className="alt-y-label"
          xPercent={0.025}
          yPercent={0}
          style={{
            textAnchor: "end",
            transform: "rotate(-90)",
            fontSize: 20,
          }}
        />
        <VerticalBarSeries
          animation
          data={stockList}
          colorType="literal"
        />
        <LabelSeries
          animation
          allowOffsetToBeReversed
          labelAnchorX="middle"
          labelAnchorY="text-after-edge" 
          data={stockList}
        />
      </FlexibleXYPlot>
  );
}
export default Chart;