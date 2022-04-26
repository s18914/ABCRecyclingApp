import React from 'react'
import Button from '../Button'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "axios";


const columns = [
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
      name: 'Id',
      selector: row => row.transport_id,
    },
];

const Transports = () => {
  const [transportList, setTransportList] = useState([]);

  Axios.get('http://localhost:3001/transports').then((response) => {
    setTransportList(response.data);
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
        <Button color={'red'} text={'Usuń'}/>
        <Button color={'blue'} text={'Edytuj'}/>
      </div>
    </div>
  );
}

export default Transports