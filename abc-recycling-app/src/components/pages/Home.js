import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import StockInfo from "./StockInfo";
import "../../../node_modules/react-vis/dist/style.css";

const Home = props => {

  const [oldCarsList, setOldCarsList] = useState([]);
  const columns = [
    {
      name: 'Powiadomienia',
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

    <div className='grid-container'>
      <div class='item1' >
      <StockInfo/>
      </div>
      <div class='item2'>
      <DataTable className='main'
          columns={columns}
          data={oldCarsList}
          noDataComponent=''
        />
      </div>
      <div class='item3'>
      <DataTable className='main'
          columns={columns}
          data={oldCarsList}
          noDataComponent=''
        />
      </div>
    </div>

  );
}

export default Home