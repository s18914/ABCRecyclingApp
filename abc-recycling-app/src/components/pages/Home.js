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

  // return (
  //     // <DataTable className='main'
  //     //   columns={columns}
  //     //   data={oldCarsList}
  //     //   noDataComponent=''
  //     // />
  // );
}

export default Home