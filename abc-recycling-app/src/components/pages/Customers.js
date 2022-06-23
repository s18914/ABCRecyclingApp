import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import {Link} from 'react-router-dom';
import { useState } from "react";
import Axios from "../../request";
import { FaTimes, FaBuilding, FaUserAlt} from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'

const Customers = props => {
  
  const companyBtn = document.getElementById('companyBtn');
  const personBtn = document.getElementById('personBtn');
  const [customerList, setCustomerList] = useState([]);
  const [onlyCompanies, setMode] = useState(true);
  const paginationComponentOptions = {
    rowsPerPageText: 'Rekordów na stronie',
    rangeSeparatorText: 'z',
  };
  const columns =  [
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
      selector: row => row.id_number,
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
        <Link to={`/customers/edit/${row.id}`}>
        <FaPen
          style={{color: 'grey', cursor: 'pointer', transform: 'scale(1.4)'}}
        />
        </Link>
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
    setMode(true);
    personBtn.style.color = 'grey';
    personBtn.style.border = 'none';
    companyBtn.style.color = 'green';
    companyBtn.style.border = '2px solid green';
  }

  const showPersons = () => {
    setMode(false);
    personBtn.style.color = 'green';
    personBtn.style.border = '2px solid green';
    companyBtn.style.color = 'grey';
    companyBtn.style.border = 'none';
  }

  const deleteCustomer =  (id) => {
    Axios.delete(`/customerDelete/${id}`).then((response) => {
      setCustomerList(
        customerList.filter((row) => {
          return row.id !== id;
        })
      );
    });
  };

  useEffect(() => {
    Axios('/customers').then(
      response => {
        setCustomerList(
          onlyCompanies ? response.data.filter(e => e.type === 'C') : response.data.filter(e => e.type === 'P') 
        );
      }
    )
  }, [onlyCompanies]);

  return (
    <div className='main'>
      <div className='btn-panel'>
        <div onClick={() => showCompanies()}>
          <FaBuilding id='companyBtn' style={{color: 'green', border: '2px solid green', cursor: 'pointer', transform: 'scale(2.2)', margin: '0 50px', padding: '2px'}} />
        <div style={{textAlign: 'center', padding: '5px'}}>Firmy</div>
        </div>
        <div onClick={() => showPersons()}>
          <FaUserAlt id='personBtn' style={{color: 'grey', cursor: 'pointer', transform: 'scale(2.2)', margin: '0 50px', padding: '2px'}} />
          <div style={{textAlign: 'center', padding: '5px'}}>Osoby</div>
        </div>
      </div>
      <DataTable
        title="Lista klientów"
        columns={columns}
        data={customerList}
        noDataComponent='brak rekordów'
        pagination
        paginationComponentOptions={paginationComponentOptions}
      />
      <div className='btn-panel-small'>
        <Link to={'/customers/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(2.2)'}} />
        </Link>
      </div>
    </div>
  );
}

export default Customers