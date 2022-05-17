import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "axios";
import { FaTimes, FaBuilding, FaUserAlt} from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'

const Customers = props => {
  let filteredList;
  const [customerList, setCustomerList] = useState([]);
  const columns =  [
    {
      name: 'Typ',
      width: '60px',
      selector: row => row.type,
    },
    {
      name: 'Klient',
      width: '200px',
      selector: row => row.name,
    },
    {
      name: 'Nazwisko',
      width: '120px',
      selector: row => row.surname,
    },
    {
      name: 'Numer dowodu',
      width: '180px',
      selector: row => row.idnumber,
    },
    {
      name: 'NIP',
      width: '150px',
      selector: row => row.nip,
    },
    {
      name: 'Konto',
      width: '180px',
      selector: row => row.account_number,
    },
    {
      name: 'E-mail',
      width: '180px',
      selector: row => row.email,
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <a href={`/customers/edit/${row.id}`}>
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
            onClick={() => deleteCustomer(row.id)}
        />
      )
    },
  ];
  
  const showCompanies = () => {
    setCustomerList(
      customerList.filter((e) => {
        return e.type === 'C';
      })
    );
  }

  const showPersons = () => {
    setCustomerList(
      customerList.filter(e => e.type === 'P')
    );
  }

  const deleteCustomer =  (id) => {
    Axios.delete(`http://localhost:3001/customerDelete/${id}`).then((response) => {
      setCustomerList(
        customerList.filter((row) => {
          return row.id !== id;
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
      <div className='btn-panel'>
      <div onClick={() => showCompanies()}>
          <FaBuilding style={{color: 'grey', cursor: 'pointer', transform: 'scale(2.2)', margin: '0 50px'}} />
        </div>
        <div onClick={() => showPersons()}>
          <FaUserAlt style={{color: 'grey', cursor: 'pointer', transform: 'scale(2.2)', margin: '0 50px'}} />
        </div>
      </div>
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