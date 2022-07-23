import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import {Link} from 'react-router-dom';
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'
import FilterComponent from "../FilterComponent";


const Addresses = props => {

  const [addressesList, setAddressesList] = useState([]);
  const columns =  [
    {
      name: 'Id',
      width: '60px',
      selector: row => row.address_id,
    },
    {
      name: 'Ulica:',
      selector: row => row.street,
    },
    {
      name: 'Numer domu',
      selector: row => row.house_number,
    },
    {
      name: 'Numer lokalu',
      selector: row => row.flat_number,
    },
    {
      name: 'Miasto',
      selector: row => row.city,
    },
    {
      name: 'Województwo',
      selector: row => row.province,
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <Link to={`/address/edit/${row.address_id}`}>
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
            onClick={() => deleteaddress(row.address_id)}
        />
      )
    }
  ];
  
  const deleteaddress = (id) => {
    Axios.delete(`/addressDelete/${id}`).then((response) => {
      setAddressesList(
        addressesList.filter((row) => {
          return row.address_id !== id;
        })
      );
    });
  };

  useEffect(() => {
    Axios('/addresses').then(
      response => {
        setAddressesList(response.data);
      }
    )
  }, []);

  return (
    <div className='main'>
      <DataTable
        title="Lista adresów"
        columns={columns}
        data={addressesList}
        noDataComponent='brak rekordów'
      />
      <div className='btn-panel'>
        <Link to={'/address/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(5.2)'}} />
        </Link>
      </div>
    </div>
  );
}

export default Addresses