import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import {Link} from 'react-router-dom';
import ProductsOfDocument from './ProductsOfDocument';
import {IoArrowBack, IoArrowForward} from 'react-icons/io5' 
import {FaTimes, FaPen} from 'react-icons/fa'
import {AiOutlinePlusSquare, AiFillPlusSquare} from 'react-icons/ai'
import {GiReceiveMoney} from 'react-icons/gi'

const Sales = props => {
  
  const [saleList, setSaleList] = useState([]);
  const [docId, setDocId] = useState(0);

  const columns =  [
    {
      name: 'Kontrahent',
      width: '220px',
      selector: row => row.name,
    },
    {
      name: 'Cena',
      width: '80px',
      selector: row => row.price,
    },
    {
      name: 'Adres',
      width: '200px',
      padding: '0',
      cell: row => {
        if (row.transport_info === 'Nieustalony') {
          return (
            <div
              style={{backgroundColor: '#41B53D', color: 'white', cursor: 'pointer', width: '150px', textAlign: 'center', fontWeight: '600', borderRadius: '3px', padding: '0'}}
              onClick={() => addAddress(row.sales_id)}
            >+</div>
          );
        } else {
          return (
            row.status
          );
        }
      },
    },
    {
      name: 'Status wysyłki',
      width: '140px',
      selector: row => row.status
    },
    {
      name: "Zmień status",
      button: true,
      width: '180px',
      cell: row => (
        <>
          <IoArrowBack
            style={{color: '#41B53D', cursor: 'pointer', transform: 'scale(1.8)', margin: '0 30px'}}
            onClick={() => prevStatus(row.sales_id, row.status_id)}
          />
          <IoArrowForward
            style={{color: '#41B53D', cursor: 'pointer', transform: 'scale(1.8)', marginRight: '30px'}}
            onClick={() => nextStatus(row.sales_id, row.status_id)}
          />
        </>
      )
    },
    {
      name: "Płatność",
      button: true,
      width: '120px',
      cell: row => {
        if (row.is_paid > 0) {
          return (
            <GiReceiveMoney
              style={{color: '#41B53D', cursor: 'pointer', transform: 'scale(1.8)'}}
              onDoubleClick={() => setPayment(row.sales_id, 0)}
            />
          );
        } else {
          return (
            <GiReceiveMoney
              style={{color: 'grey', cursor: 'pointer', transform: 'scale(1.8)'}}
              onClick={() => setPayment(row.sales_id, 1)}
            />
          );
        }
      },
    },
    {
      name: "",
      button: true,
      width: '50px',
      cell: row => (
        <Link to={`/sales/edit/${row.id}`}>
          <FaPen
            style={{color: 'grey', cursor: 'pointer', transform: 'scale(1.4)'}}
          />
        </Link>
      )
    },
    {
      name: "",
      button: true,
      width: '50px',
      cell: row => (
        <FaTimes
            style={{color: '#D83232', cursor: 'pointer', transform: 'scale(1.5)'}}
            onClick={() => deleteSale(row.sale_id)}
        />
      )
    },
  ];
  
  const deleteSale =  (id) => {
    Axios.delete(`/SaleDelete/${id}`).then((response) => {
      setSaleList(
        saleList.filter((row) => {
          return row.sale_id !== id;
        })
      );
    });
  };

  const nextStatus =  (id, status) => {
    Axios.put('/SaleUpdateStatus', {
      id: id,
      status_id: ++status
    }).then((response) => {
      console.log("success", response.data);
    });
  };

  const prevStatus =  (id, status) => {
    Axios.put('/SaleUpdateStatus', {
      id: id,
      status_id: --status
    }).then((response) => {
      console.log("success", response.data);
    });
  };

  const setPayment =  (id, val) => {
    Axios.put('/SaleUpdatePayment', {
      id: id,
      val: val
    }).then((response) => {
      console.log("success", response.data);
    });
  };

  const addAddress =  (id) => {
    return 1;
  };

  useEffect(() => {
    Axios('/sales').then(
      response => {
        setSaleList(response.data);
        setDocId(response.data?.document_id);
      }
    )
  }, [docId]);

  return (
    <div className='main'>
      <DataTable
        title="Lista sprzedaży"
        columns={columns}
        data={saleList}
        onRowClicked={(row, event) => {
          setDocId(row.sales_id);
        }}
      />
      <div className='btn-panel-small'>
        <Link to={'/sales/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(2.0)'}} />
        </Link>
      </div>
      <ProductsOfDocument id={docId}/>
    </div>
  );
}

export default Sales