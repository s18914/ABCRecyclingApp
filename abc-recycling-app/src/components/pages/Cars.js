import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'

const Cars = props => {
  const [CarsList, setCarsList] = useState([]);
  const columns =  [
    {
      name: 'Id',
      width: '60px',
      selector: row => row.car_id,
    },
    {
      name: 'Numer rejestracyjny',
      selector: row => row.registration_number,
    },
    {
      name: 'Data wazności przeglądu',
      //selector: row => moment(row.overview_date).format("DD/MM/YYYY"),
      selector: row => row.overview_date,
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <a href={`/Cars/edit/${row.car_id}`}>
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
            onClick={() => deleteCar(row.car_id)}
        />
      )
    },
  ];
  
  const deleteCar = (id) => {
    Axios.delete(`/carDelete/${id}`).then((response) => {
      setCarsList(
        CarsList.filter((row) => {
          return row.car_id !== id;
        })
      );
    });
  };

  useEffect(() => {
    Axios('/Cars').then(
      response => {
        setCarsList(response.data);
      }
    )
  });

  return (
    <div className='main'>
      <DataTable
        title="Lista samochodów"
        columns={columns}
        data={CarsList}
      />
      <div className='btn-panel'>
        <a href={'/cars/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(5.2)'}} />
        </a>
      </div>
    </div>
  );
}

export default Cars