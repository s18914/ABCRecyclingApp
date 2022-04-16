import React from 'react'
import Button from '../Button'
import DataTable from 'react-data-table-component'


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
      selector: row => row.telephone,
    },
    {
      name: 'Status',
      selector: row => row.status,
    },
];

const data = [
    {
      id: 1,
      address: 'Jutrzenki 7a/44 Warszawa',
      date: '01.01.2022',
      telephone: '515 765 543',
      status: 'Planowany',
    },
    {
      id: 1,
      address: 'Jutrzenki 7a/44 Warszawa',
      date: '01.01.2022',
      telephone: '515 765 543',
      status: 'Planowany',
    },
]

const Transports = () => {
  const [pending, setPending] = React.useState(true);
  const [rows, setRows] = React.useState([]);

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
        <Button color={'green'} text={'Dodaj'} />
        <Button color={'red'} text={'Usuń'}/>
        <Button color={'blue'} text={'Edytuj'}/>
      </div>
    </div>
  );
}

export default Transports