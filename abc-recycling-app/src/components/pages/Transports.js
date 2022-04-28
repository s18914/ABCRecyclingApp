import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "axios";
import { FaBalanceScale, FaGlasses } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'

const Transports = props => {

  const [transportList, setTransportList] = useState([]);
  const columns =  [
    {
      name: 'Id',
      width: '60px',
      selector: row => row.transport_id,
    },
    {
      name: 'Adres',
      selector: row => row.address,
    },
    {
      name: 'Telefon',
      width: '180px',
      selector: row => row.phone,
    },
    {
      name: 'Data',
      width: '180px',
      selector: row => row.date,
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <a href={'/transports/details'}>
        <FaGlasses
          style={{color: '#3286DA', cursor: 'pointer', transform: 'scale(1.4)'}} 
          //onClick={() => onShow(task.id)}
        />
        </a>
      )
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <a href={'/transports/edit'}>
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
            onClick={() => deleteTransport(row.transport_id)}
        />
      )
    },
  ];
  
  const deleteTransport =  (id) => {
    Axios.delete(`http://localhost:3001/transportDelete/${id}`).then((response) => {
      setTransportList(
        transportList.filter((row) => {
          console.log(id + " to moje id")
          return row.transport_id !== id;
        })
      );
    });
  };

  useEffect(() => {
    Axios('http://localhost:3001/transports').then(
      response => {
        setTransportList(response.data);
      }
    )
  });

  return (
    <div className='main'>
      <DataTable
        title="Lista transportów"
        columns={columns}
        data={transportList}
      />
      <div className='btn-panel'>
        <a href={'/transports/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(5.2)'}} />
        </a>
      </div>
    </div>
  );
}

export default Transports