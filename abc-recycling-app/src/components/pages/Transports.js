import React, { useEffect } from 'react'
import Button from '../Button'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "axios";
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'

const Transports = props => {

  const [transportList, setTransportList] = useState([]);
  const columns =  [
    {
      name: 'Id',
      selector: row => row.transport_id,
    },
    {
      name: 'Adres',
      selector: row => row.address,
    },
    {
      name: 'Telefon',
      selector: row => row.phone,
    },
    {
      name: 'Data',
      selector: row => row.date,
    },
    {
      name: "",
      button: true,
      cell: row => (
        <FaPen
          style={{color: 'grey', cursor: 'pointer'}} 
          //onClick={() => onEdit(task.id)}
        />
      )
    },
    {
      name: "",
      button: true,
      cell: row => (
        <FaTimes
            style={{color: 'red', cursor: 'pointer'}} 
            //onClick={() => onDelete(task.id)}
        />
      )
    },
  ];

  const deleteTransport =  (id) => {
    Axios.delete(`http://localhost:3001/transportDelete/${id}`);
  }

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
        <Button color={'green'} text={'Dodaj'} to={'/transports/add'}/>
        {/* <Button 
          onClick={() => {
            console.log('clicked');
            deleteTransport(transportList.transport_id);
          }}
          color={'red'}
          text={'Usuń'}
        >
        </Button>
        <Button color={'blue'} text={'Edytuj'}/> */}
      </div>
    </div>
  );
}

export default Transports