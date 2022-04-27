import React from 'react'
import Button from '../Button'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "axios";


const columns = [
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
];

const deleteTransport =  (id) => {
  Axios.delete('http://localhost:3001/transportDelete/${id}');
}

const Transports = () => {
  const [transportList, setTransportList] = useState([]);

  Axios.get('http://localhost:3001/transports').then((response) => {
    setTransportList(response.data);
  });


  return (
    <div className='main'>
      <DataTable
        selectableRows
        clearSelectedRows
        title="Lista transportów"
        columns={columns}
        data={transportList}
      />
      <div className='btn-panel'>
        <Button color={'green'} text={'Dodaj'} to={'/transports/add'}/>
        <Button 
          onClick={() => {
            console.log('clicked');
            //deleteTransport(transportList.transport_id)
          }}
          color={'red'}
          text={'Usuń'}
        >
        </Button>
        <Button color={'blue'} text={'Edytuj'}/>
      </div>
    </div>
  );
}

export default Transports