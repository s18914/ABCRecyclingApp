import React, { useEffect } from 'react'
import { useState } from "react";
import Axios from "axios";

function ProductsOfDocument(props) {
  const [productList, setProductList] = useState([]);
  const [sum, setSum] = useState(0);

  useEffect(() => {
    let id = props.id;
    if(id !== undefined) {
      Axios.get(`http://localhost:3001/documentProducts/${id}`).then(
        response => {
          setProductList(
            JSON.parse(JSON.stringify(response.data))
          );
        }
      )
    }
    
    setSum(countSum())
  }); 

  const countSum = () => {
    let s = 0;
    productList.map((item) => {
      s = s + parseFloat(item.weight);
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
        let num1 = Math.round((item.price/sum*100) );
        let gradient = 'linear-gradient(90deg, #8bdaff '+ num1 + '%, #ffffff ' + num1 + '%)';

        return (
          <ol>
            <div style={{background: gradient}}>{item.type_name}</div>
            <div>{item.weight}</div>
            <div>{item.price}</div>
          </ol>
        );
      })}
    </ul>
  );
}

export default ProductsOfDocument;