import React, { useState, useEffect } from "react";
import Axios from "../../request";

import {
  FlexibleXYPlot,
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalBarSeries,
  LabelSeries,
  ChartLabel
} from "react-vis";

export default function Example(props) {
  const [stockList, setStockList] = useState([]);
  let r = 150;
  let g = 211;
  let b = 227;

  useEffect(() => {
    Axios.get(`/getStock`).then(
      response => {
        setStockList(
          JSON.parse(JSON.stringify(response.data))
        );
      }
    )

    // {stockList.map((type) => {
      
    //   let color = `rgb(${r} ${g} ${b})`;
    //   r -= 10;
    //   g -= 15;
    //   b -= 25;

    //   return (
    //     
    //   );
    // })}
  }, []);

  const initialGraphData = [
    { x: "Papier", y: 150000, label: "150,000", color: "#96d3e3" },
    { x: "Aluminium", y: 250000, label: "250,000", color: "#6bafc2" },
    { x: "Złoto", y: 500000, label: "500,000", color: "#017fb1" },
    { x: "Miedź", y: 750000, label: "750,000", color: "#01678e" }
  ];

  

  return (
    <FlexibleXYPlot
        animation
        xType="ordinal"
        height={400}
        xDistance={100}
        yDomain={[0, 1050000]}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis
          style={{
            line: { stroke: "black" },
            text: { stroke: "none", fill: "black", fontWeight: 600 }
          }}
        />
        <ChartLabel
          text=""
          className="alt-y-label"
          xPercent={0.025}
          yPercent={0}
          style={{
            textAnchor: "end",
            transform: "rotate(-90)",
            fontSize: 20,
            textTransform: "uppercase"
          }}
        />
        <VerticalBarSeries
          animation
          data={initialGraphData}
          colorType="literal"
        />
        <LabelSeries
          animation
          allowOffsetToBeReversed
          labelAnchorX="middle"
          labelAnchorY="text-after-edge"
          data={initialGraphData}
        />
      </FlexibleXYPlot>
  );
}
