import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import ProductsOfDocument from './ProductsOfDocument';
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'

const Purchases = props => {

  const [purchaseList, setPurchaseList] = useState([]);
  const [docId, setDocId] = useState(0);
  const columns =  [
    {
      name: 'Kontrahent',
      width: '280px',
      selector: row => row.name,
    },
    {
        name: 'Cena',
        width: '100px',
        selector: row => row.price,
    },
    {
      name: 'Adres',
      width: '200px',
      padding: '0',
      cell: row => {
        if (row.transport_info === 'Nieustalony') {
          return (
            <div
              style={{backgroundColor: '#41B53D', color: 'white', cursor: 'pointer', width: '150px', textAlign: 'center', fontWeight: '600', borderRadius: '3px', padding: '0'}}
              onClick={() => addAddress(row.sales_id)}
            >+</div>
          );
        } else {
          return (
            row.status
          );
        }
      },
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
    Axios.delete(`/PurchaseDelete/${id}`).then((response) => {
      setPurchaseList(
        purchaseList.filter((row) => {
          return row.purchase_id !== id;
        })
      );
    });
  };

  const addAddress =  (id) => {
    return 1;
  };

  useEffect(() => {
    Axios('/purchases').then(
      response => {
        setPurchaseList(response.data);
        setDocId(response.data?.document_id);
      }
    )
  });

  return (
    <div className='main'>
      <DataTable
        title="Lista zakupów"
        columns={columns}
        data={purchaseList}
        onRowClicked={(row, event) => {
          setDocId(row.purchase_id);
        }}
      />
      <div className='btn-panel-small'>
        <a href={'/purchases/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(2.2)'}} />
        </a>
      </div>
      <ProductsOfDocument id={docId}/>
    </div>
  );
}

export default Purchases