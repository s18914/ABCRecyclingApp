import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import {Link} from 'react-router-dom';
import ProductsOfDocument from './ProductsOfDocument';
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'

const Purchases = props => {

  const [purchaseList, setPurchaseList] = useState([]);
  const [docId, setDocId] = useState(0);
  const paginationComponentOptions = {
    rowsPerPageText: 'Rekordów na stronie',
    rangeSeparatorText: 'z',
  };
  const columns =  [
    {
      name: 'Kontrahent',
      width: '280px',
      selector: row => row.name,
    },
    {
        name: 'Cena',
        width: '100px',
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
              onClick={() => addAddress(row.purchase_id)}
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
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <Link to={`/purchases/edit/${row.purchase_id}`}>
        <FaPen
          style={{color: 'grey', cursor: 'pointer', transform: 'scale(1.4)'}}
        />
        </Link>
      )
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <FaTimes
            style={{color: '#D83232', cursor: 'pointer', transform: 'scale(1.5)'}}
            onClick={() => deletePurchase(row.purchase_id)}
        />
      )
    },
  ];
  
  const deletePurchase =  (id) => {
    Axios.delete(`/documentDelete/${id}`).then((response) => {
      setPurchaseList(
        purchaseList.filter((row) => {
          return row.purchase_id !== id;
        })
      );
    });
  };

  const addAddress =  (id) => {
    return 1;
  };

  useEffect(() => {
    Axios('/purchases').then(
      response => {
        setPurchaseList(response.data);
        setDocId(response.data?.document_id);
      }
    )
  }, [docId]);

  return (
    <div className='main'>
      <DataTable
        title="Lista zakupów"
        columns={columns}
        data={purchaseList}
        noDataComponent='brak rekordów'
        onRowClicked={(row, event) => {
          setDocId(row.purchase_id);
        }}
        pagination
        paginationComponentOptions={paginationComponentOptions}
      />
      <div className='btn-panel-small'>
        <Link to={'/purchases/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(2.2)'}} />
        </Link>
      </div>
      <ProductsOfDocument id={docId}/>
    </div>
  );
}

export default Purchases