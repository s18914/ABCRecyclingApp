import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import StockInfo from "./StockInfo";
import "../../../node_modules/react-vis/dist/style.css";

const Home = props => {

  const [oldCarsList, setOldCarsList] = useState([]);
  const [oldSalesList, setOldSalesList] = useState([]);

  const columns = [
    {
      name: 'Powiadomienia',
      selector: row => row.info,
    }
  ];

  const columnsSales = [
    {
      name: 'Najważniejsze informacje o sprzedaży',
      selector: row => row.infoSale,
    }
  ];

  useEffect(() => {
    Axios('/getOldCars').then(
      response => {
        setOldCarsList(response.data);
      }
    )
    Axios('/getOldSales').then(
      response => {
        setOldSalesList(response.data);
      }
    )
  }, []);

  return (
    <div className='grid-container'>
      <div className='itemHeader'>
        Strona główna
      </div>
      <div className='main' style={{ gridArea: 'item1', paddingLeft: '20px' }}>
      <StockInfo/>
      </div>
      <div className='item2'>
      <DataTable className='main'
          columns={columns}
          data={oldCarsList}
          noDataComponent=''
        />
      </div>
      <div className='item3'>
      <DataTable className='main'
          columns={columnsSales}
          data={oldSalesList}
          noDataComponent=''
        />
      </div>
    </div>

  );
}

export default Home