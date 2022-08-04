import React, { useState, useEffect } from "react";
import Axios from "../../request";

function StockInfo() {

  const [stockList, setStockList] = useState([]);

  useEffect(() => {
    Axios.get(`/getStock`).then(
      response => {
        setStockList(
          JSON.parse(JSON.stringify(response.data))
        );
      }
    )
  })

  return (
    <div>
      <h3>Stan magazynu</h3>
      <ul className='stock-info'>
        <ol> 
          <div>Produkt</div>
          <div>Masa</div> 
        </ol>
        {stockList.map((item) => {
          return (
            <ol key={item.type_id}>
              <div>{item.x}</div>
              <div>{item.y}</div>
            </ol>
          );
        })}
      </ul>
    </div>
  );
}


export default StockInfo