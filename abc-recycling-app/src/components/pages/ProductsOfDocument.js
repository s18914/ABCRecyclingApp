import React, { useEffect } from 'react'
import { useState } from "react";
import Axios from "../../request";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {FaPen} from 'react-icons/fa'

function ProductsOfDocument({refresh, ...props}) {
  const [productList, setProductList] = useState([]);
  const [sum, setSum] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState(undefined);

  const countSum = (data) => {
    let s = 0;
    data.map((item) => {
      s = s + parseFloat(item.price);
    })
    return s;
  }

  useEffect(() => {
    if(props.id !== undefined && props !== undefined) setId(props.id)
    if(id !== undefined) {
      Axios.get(`/documentProducts/${id}`).then(
        response => {
          const data = JSON.parse(JSON.stringify(response.data))
          setProductList(data);
          setSum(countSum(data));
        }
      )
    }

  }, [props.id]);

  //modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
  };

  function updateProducts() {
    try {
      productList.forEach(prod => {
        const id = prod.document_id;
        const inputPriceId = 'priceOf' + prod.type_id;
        const inputWeightId = 'weightOf' + prod.type_id;
        let weight = document.getElementById(inputWeightId).value;
        let price = document.getElementById(inputPriceId).value;
        if (weight === '' || weight === null) weight = 0;
        if (price === '' || price === null) price = 0;

        Axios.put('/productUpdate', {
          document_id: id,
          type_id: prod.type_id,
          price: price,
          weight: weight
        }).then((response) => {
          console.log("success", response.data);
          handleClose();
        });
      });

      refresh(id);
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
        <div/>
        <div>Masa</div> 
        <div>Cena</div>
      </ol>
      {productList.map((item) => {
        return (
          <ol key={item.type_id}>
            <div>{item.type_name}</div>
            <div style={{background: sum > 0 ? "linear-gradient(90deg, rgb(190 222 237) "+ Math.round((item.price/sum*100)) + "%, #ffffff " + Math.round((item.price/sum*100)) + "%)" : null}} />
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
                  <input id={inputWeightId} defaultValue = {item?.weight}></input>
                  <div>Cena:  {item.price}</div>
                  <input id={inputPriceId} defaultValue = {item?.price}></input>
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