import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "axios";
import {IoArrowBack, IoArrowForward} from 'react-icons/io5' 
import {FaTimes, FaPen} from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'
import {GiReceiveMoney} from 'react-icons/gi'

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
      width: '120px',
      selector: row => row.name,
    },
    {
      name: 'Cena',
      width: '80px',
      selector: row => row.price,
    },
    {
      name: 'Adres',
      width: '180px',
      selector: row => row.transport_info,
    },
    {
      name: 'Status wysyłki',
      width: '120px',
      selector: row => row.status,
    },
    {
      name: "Zmień status",
      button: true,
      width: '180px',
      cell: row => (
        <>
          <IoArrowBack
            style={{color: '#41B53D', cursor: 'pointer', transform: 'scale(1.4)', margin: '0 30px'}}
            onClick={() => prevStatus(row.sale_id, row.status_id)}
          />
          <IoArrowForward
            style={{color: '#41B53D', cursor: 'pointer', transform: 'scale(1.4)', marginRight: '30px'}}
            onClick={() => nextStatus(row.sale_id, row.status_id)}
          />
        </>
      )
    },
    {
      name: "Płatność",
      button: true,
      width: '100px',
      cell: row => (
        <GiReceiveMoney
          style={{color: 'grey', cursor: 'pointer', transform: 'scale(1.4)'}}
        />
      )
    },
    {
      name: "",
      button: true,
      width: '50px',
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
      width: '50px',
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

  const nextStatus =  (id, status) => {
    Axios.put(`http://localhost:3001/SaleUpdateStatus/${id}`, {
      status_id: ++status
    }).then((response) => {
      console.log("success", response.data);
    });
  };

  const prevStatus =  (id, status) => {
    Axios.put(`http://localhost:3001/SaleUpdateStatus/${id}`, {
      status_id: --status
    }).then((response) => {
      console.log("success", response.data);
    });
  };

  useEffect(() => {
    Axios('http://localhost:3001/sales').then(
      response => {
        console.log(response.data)
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