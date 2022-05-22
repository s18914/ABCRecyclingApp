import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "axios";
import { FaBalanceScale, FaGlasses } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'

const Workers = props => {

  const [workersList, setWorkersList] = useState([]);
  const columns =  [
    {
      name: 'Id',
      width: '60px',
      selector: row => row.worker_id,
    },
    {
      name: 'Imię',
      width: '200px',
      selector: row => row.name,
    },
    {
      name: 'Nazwisko',
      width: '200px',
      selector: row => row.surname,
    },
    {
      name: 'Numer dowodu',
      width: '200px',
      selector: row => row.idNumber,
    },
    // {
    //   name: 'Rola',
    //   width: '200px',
    //   selector: row => row.role,
    // },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <a href={`/Workers/details/${row.worker_id}`}>
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
        <a href={`/Workers/edit/${row.worker_id}`}>
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
            onClick={() => deleteWorker(row.worker_id)}
        />
      )
    },
  ];
  
  const deleteWorker =  (id) => {
    Axios.delete(`http://localhost:3001/workerDelete/${id}`).then((response) => {
      setWorkersList(
        workersList.filter((row) => {
          return row.worker_id !== id;
        })
      );
    });
  };

  useEffect(() => {
    Axios('http://localhost:3001/workers').then(
      response => {
        setWorkersList(response.data);
      }
    )
  });

  return (
    <div className='main'>
      <DataTable
        title="Lista pracowników"
        columns={columns}
        data={workersList}
      />
      <div className='btn-panel'>
        <a href={'/workers/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(5.2)'}} />
        </a>
      </div>
    </div>
  );
}
export default Workers