import React, { useEffect, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import {Link} from 'react-router-dom';

const Home = props => {

  const [oldCarsList, setOldCarsList] = useState([]);
  const columns =  [
    {
      name: 'Powiadomienia',
      selector: row => row.info,
    }
  ];

  const [notesList, setNotesList] = useState([]);
  const notesColumns =  [
    {
      name: 'Notatki',
      selector: row => row.info,
    }
  ];

  useEffect(() => {
    Axios('/getOldCars').then(
      response => {
        setOldCarsList(response.data);
      }
    )
  }, []);

  return (
    <table className='main'>
    <tr>
      <td style={{padding: '20px'}}>
      <DataTable
        columns={columns}
        data={oldCarsList}
        noDataComponent=''
      />
      </td>
      <td style={{padding: '20px'}}>
      <DataTable
        columns={notesColumns}
        data={notesList}
        noDataComponent=''
      />
      <label>Nowa notatka</label>
      <textarea style={{width: '550px'}}></textarea>
      <button>Dodaj</button>
      </td>
    </tr>
  </table>
  );
}

export default Home