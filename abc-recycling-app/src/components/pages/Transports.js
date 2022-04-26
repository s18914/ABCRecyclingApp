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
      name: 'Data',
      selector: row => row.date,
    },
    {
      name: 'Telefon',
      selector: row => row.phone,
    },
    {
      name: 'Status',
      selector: row => row.status,
    },
];

// const data = [
//     {
//       id: 1,
//       address: 'Jutrzenki 7a/44 Warszawa',
//       date: '01.01.2022',
//       phone: '515 765 543',
//       status: 'Planowany',
//     }
// ]

const Transports = () => {
  const [pending, setPending] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [transportList, setTransportList] = useState([]);

  Axios.get('http://localhost:3001/transports').then((response) => {
    setTransportList(response.data);
  });

  
  
  // var data = transportList.map((val, key) => {
  //   return (
      
  //   )
  // });
  const data = [
    {
      id: transportList.transport_id,
      address: transportList.address,
      date: transportList.data,
      phone: transportList.phone,
      status: 'Planowany',
    }
]

  const onClick = () => {
    console.log('+')
  }

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setRows(data);
      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className='main'>
      <DataTable
        title="Lista transportów"
        columns={columns}
        data={rows}
        progressPending={pending}
        pagination
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