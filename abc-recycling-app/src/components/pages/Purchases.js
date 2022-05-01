import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "axios";
import { FaBalanceScale, FaGlasses } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'

const Purchases = props => {

  const [purchaseList, setPurchaseList] = useState([]);
  const columns =  [
    {
      name: 'Id',
      width: '60px',
      selector: row => row.purchase_id,
    },
    {
      name: 'Kontrahent',
      width: '180px',
      selector: row => row.customerName,
    },
    {
        name: 'Cena',
        selector: row => row.price,
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <a href={'/purchases/details'}>
        <FaGlasses
          style={{color: '#3286DA', cursor: 'pointer', transform: 'scale(1.4)'}}
        />
        </a>
      )
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <a href={'/purchase/edit'}>
        <FaPen
          style={{color: 'grey', cursor: 'pointer', transform: 'scale(1.4)'}}
        />
        </a>
      )
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <FaTimes
            style={{color: '#D83232', cursor: 'pointer', transform: 'scale(1.5)'}}
            onClick={() => deletePurchase(row.purchase_id)}
        />
      )
    },
  ];
  
  const deletePurchase =  (id) => {
    Axios.delete(`http://localhost:3001/PurchaseDelete/${id}`).then((response) => {
      setPurchaseList(
        purchaseList.filter((row) => {
          return row.purchase_id !== id;
        })
      );
    });
  };

  useEffect(() => {
    Axios('http://localhost:3001/purchases').then(
      response => {
        setPurchaseList(response.data);
      }
    )
  });

  return (
    <div className='main'>
      <DataTable
        title="Lista zakupów"
        columns={columns}
        data={purchaseList}
      />
      <div className='btn-panel'>
        <a href={'/purchases/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(5.2)'}} />
        </a>
      </div>
    </div>
  );
}

export default Purchases