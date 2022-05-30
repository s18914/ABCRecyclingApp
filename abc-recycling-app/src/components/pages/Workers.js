import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import { FaGlasses } from 'react-icons/fa'
import {Link} from 'react-router-dom';
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
    {
      name: 'Rola',
      width: '200px',
      selector: row => row.roleName,
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <Link to={`/Workers/details/${row.worker_id}`}>
          <FaGlasses
            style={{color: '#3286DA', cursor: 'pointer', transform: 'scale(1.4)'}} 
          />
        </Link>
      )
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <Link to={`/Workers/edit/${row.worker_id}`}>
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
            onClick={() => deleteWorker(row.worker_id)}
        />
      )
    },
  ];
  
  const deleteWorker =  (id) => {
    Axios.delete(`/workerDelete/${id}`).then((response) => {
      setWorkersList(
        workersList.filter((row) => {
          return row.worker_id !== id;
        })
      );
    });
  };

  useEffect(() => {
    Axios('/workers').then(
      response => {
        setWorkersList(response.data);
      }
    )
  }, []);

  return (
    <div className='main'>
      <DataTable
        title="Lista pracowników"
        columns={columns}
        data={workersList}
        noDataComponent='brak rekordów'
      />
      <div className='btn-panel'>
        <Link to={'/workers/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(5.2)'}} />
        </Link>
      </div>
    </div>
  );
}
export default Workers