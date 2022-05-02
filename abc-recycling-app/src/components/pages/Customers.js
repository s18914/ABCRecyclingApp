import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "axios";
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'

const Customers = props => {

  const [customerList, setCustomerList] = useState([]);
  const columns =  [
    {
      name: 'Id',
      width: '60px',
      selector: row => row.customer_id,
    },
    {
      name: 'Imię',
      width: '180px',
      selector: row => row.name,
    },
    {
      name: 'Nazwisko',
      width: '180px',
      selector: row => row.surname,
    },
    {
      name: 'Numer dowodu',
      width: '280px',
      selector: row => row.IdNumber,
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <a href={'/customers/edit'}>
        <FaPen
          style={{color: 'grey', cursor: 'pointer', transform: 'scale(1.4)'}} 
          //onClick={onEdit(task.id)}
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
            onClick={() => deleteCustomer(row.customer_id)}
        />
      )
    },
  ];
  
  const deleteCustomer =  (id) => {
    Axios.delete(`http://localhost:3001/customerDelete/${id}`).then((response) => {
      setCustomerList(
        customerList.filter((row) => {
          return row.customer_id !== id;
        })
      );
    });
  };

  useEffect(() => {
    Axios('http://localhost:3001/customers').then(
      response => {
        setCustomerList(response.data);
      }
    )
  });

  return (
    <div className='main'>
      <DataTable
        title="Lista klientów"
        columns={columns}
        data={customerList}
      />
      <div className='btn-panel'>
        <a href={'/customers/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(5.2)'}} />
        </a>
      </div>
    </div>
  );
}

export default Customers