import React, { useEffect } from 'react'
import { useState } from "react";
import Axios from "axios";

function ProductsOfDocument(props) {
  const [productList, setProductList] = useState([]);
  const [sum, setSum] = useState(0);

  useEffect(() => {
    let id = 4 //props.id;
    Axios.get(`http://localhost:3001/documentProducts/${id}`).then(
      response => {
        setProductList(
          JSON.parse(JSON.stringify(response.data))
        );
      }
    )
    setSum(countSum())
  }); 

  const countSum = () => {
    let s = 0;
    productList.map((item) => {
      s += item.weight;
    })
    return s;
  }

  return (
    <ul className='list-of-products'>
      <ol> 
        <div>Produkt</div> 
        <div>Masa</div> 
        <div>Cena</div>
      </ol>
      {productList.map((item) => {
        return (
          <ol>
            <div>{item.type_name}</div>
            <div>{item.weight}</div>
            <div>{item.price}</div>
          </ol>
        );
      })}
    </ul>
  );
}

export default ProductsOfDocument;