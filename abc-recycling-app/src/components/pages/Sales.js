import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "axios";
import { FaGlasses } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'

const Sales = props => {

  const [saleList, setSaleList] = useState([]);
  const columns =  [
    {
      name: 'Id',
      width: '60px',
      selector: row => row.sale_id,
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
      name: 'Status wysyłki',
      width: '180px',
      selector: row => row.transportAddress,
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <a href={'/sales/details'}>
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
        <a href={'/sales/edit'}>
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
            onClick={() => deleteSale(row.sale_id)}
        />
      )
    },
  ];
  
  const deleteSale =  (id) => {
    Axios.delete(`http://localhost:3001/SaleDelete/${id}`).then((response) => {
      setSaleList(
        saleList.filter((row) => {
          return row.sale_id !== id;
        })
      );
    });
  };

  useEffect(() => {
    Axios('http://localhost:3001/sales').then(
      response => {
        setSaleList(response.data);
      }
    )
  });

  return (
    <div className='main'>
      <DataTable
        title="Lista sprzedaży"
        columns={columns}
        data={saleList}
      />
      <div className='btn-panel'>
        <a href={'/sales/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(5.2)'}} />
        </a>
      </div>
    </div>
  );
}

export default Sales