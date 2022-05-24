import React, { useEffect } from 'react'
import { useState } from "react";
import Axios from "axios";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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
      s = s + parseFloat(item.weight);
    })
    return s;
  }

  //modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
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
          <ol key={item.weight}>
            <div style={{background: gradient}}>{item.type_name}</div>
            <div>{item.weight}</div>
            <div>{item.price}</div>
          </ol>
        );
      })}
      </ul>
      <div className='btn-panel-small'>
        <FaPen
          style={{color: 'grey', cursor: 'pointer'}}
          onClick={handleOpen}
        />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="Edycja listy produktów"
        aria-describedby="modal-modal-description"
      >
        <Box className='modal'>
          <h2>Modyfikuj produkty</h2>
          <form className='formAddress' onSubmit={console.log('hej')}>

            {productList.map((item) => {
              return (
                <div className='formRow' id={item.type_Id}>
                  <div>{item.type_name}</div>
                  <div>Cena:  {item.price}</div>
                  <div>Waga:  {item.weight}</div>
                  <input></input>
                </div>
              );
            })}
            <button type="submit">
              Zatwierdź
            </button>
          </form>
        </Box>
      </Modal>
    </div>
    
  );
}

export default ProductsOfDocument;