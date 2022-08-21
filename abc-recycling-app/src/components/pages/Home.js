import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import StockInfo from "./StockInfo";
import { useNavigate } from "react-router-dom";

const Home = props => {

  const [oldCarsList, setOldCarsList] = useState([]);
  const [oldSalesList, setOldSalesList] = useState([]);
  const navigate = useNavigate();

  const columnsCars = [
    {
      name: 'Powiadomienia',
      selector: row => row.info,
    }
  ];

  const columnsSales = [
    {
      name: 'Najważniejsze informacje o sprzedaży',
      selector: row => row.infosale,
    }
  ];

  useEffect(() => {
    Axios('/getOldCars').then(
      response => {
        setOldCarsList(response.data);
      }
    )
  }, []);

  useEffect(() => {
    Axios('/getOldSales').then(
      response => {
        setOldSalesList(response.data);
      }
    )
  }, []);

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("/login").then((response) => {
      if (response.data.loggedIn !== true) {
        navigate("/login");
      }
    });
  }, []);

  return (
    <div className='grid-container'>
      <div className='itemHeader'>
        Strona główna
      </div>
      <div className='main' style={{ gridArea: 'item1', paddingLeft: '20px' }}>
        <StockInfo />
      </div>
      <div className='item2'>
        <DataTable className='main'
          columns={columnsCars}
          data={oldCarsList}
          noDataComponent='brak rekordów'
        />
      </div>
      <div className='item3'>
        <DataTable className='main'
          columns={columnsSales}
          data={oldSalesList}
          noDataComponent='brak rekordów'
        />
      </div>
    </div>

  );
}

export default Home