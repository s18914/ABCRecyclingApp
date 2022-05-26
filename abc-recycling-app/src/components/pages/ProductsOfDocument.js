import React, { useEffect } from 'react'
import { useState } from "react";
import Axios from "axios";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {FaPen} from 'react-icons/fa'

function ProductsOfDocument(props) {
  const [productList, setProductList] = useState([]);
  const [sum, setSum] = useState(0);
  const [open, setOpen] = React.useState(false);

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
      s = s + parseFloat(item.price);
    })
    return s;
  }

  //modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  function updateProducts()  {
    try {
      productList.forEach(prod => {
        const inputPriceId = 'priceOf' + prod.type_id;
        const inputWeightId = 'weightOf' + prod.type_id;
        let weight = document.getElementById(inputWeightId).value;
        let price = document.getElementById(inputPriceId).value;
        if (weight === '') weight = 0;
        if (price === '') price = 0;

        Axios.put('http://localhost:3001/productUpdate', {
          document_id: props.id,
          type_id: prod.type_id,
          price: price,
          weight: weight
        }).then((response) => {
          console.log("success", response.data);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }
  //

  return (
    <div>
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
          <ol key={item.type_id}>
            <div style={{background: gradient}}>{item.type_name}</div>
            <div>{item.weight}</div>
            <div>{item.price}</div>
          </ol>
        );
      })}
      </ul>
      {sum && 
        <div className='btn-panel-small'>
          <FaPen
            style={{color: 'grey', cursor: 'pointer'}}
            onClick={handleOpen}
          />
        </div>
      } 
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="Edycja listy produktów"
      >
        <Box className='modal'>
          <h2>Modyfikuj produkty</h2>
          <form> 
            {productList.map((item) => {
              let inputPriceId = 'priceOf' + item.type_id;
              let inputWeightId = 'weightOf' + item.type_id;
              return (
                <div className='formRow' key={item.type_id}>
                  <div>{item.type_name}</div>
                  <div>Masa:  {item.weight}</div>
                  <input id={inputWeightId}></input>
                  <div>Cena:  {item.price}</div>
                  <input id={inputPriceId}></input>
                </div>
              );
            })}
            
          </form>
          <button onClick={updateProducts}>
              Zatwierdź
            </button>
        </Box>
      </Modal>
    </div>
    
  );
}

export default ProductsOfDocument;