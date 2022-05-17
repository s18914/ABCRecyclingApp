import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "axios";
import { FaBalanceScale, FaGlasses } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'

const Products = props => {

  const [productsList, setProductsList] = useState([]);
  const columns =  [
    {
      name: 'Id',
      width: '60px',
      selector: row => row.product_id,
    },
    {
      name: 'Typ produktu',
      selector: row => row.address,
    },
    {
      name: 'Cena',
      width: '180px',
      selector: row => row.price,
    },
    {
      name: 'waga',
      width: '180px',
      selector: row => row.weight,
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <a href={`/Products/details/${row.product_id}`}>
        <FaGlasses
          style={{color: '#3286DA', cursor: 'pointer', transform: 'scale(1.4)'}} 
        />
        </a>
      )
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <a href={`/Products/edit/${row.product_id}`}>
        <FaPen
          style={{color: 'grey', cursor: 'pointer', transform: 'scale(1.4)'}} 
        />
        </a>
      )
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <FaTimes
            style={{color: '#D83232', cursor: 'pointer', transform: 'scale(1.5)'}}
            onClick={() => deleteProduct(row.product_id)}
        />
      )
    },
  ];
  
  const deleteProduct =  (id) => {
    Axios.delete(`http://localhost:3001/productDelete/${id}`).then((response) => {
      setProductsList(
        productsList.filter((row) => {
          return row.product_id !== id;
        })
      );
    });
  };

  useEffect(() => {
    Axios('http://localhost:3001/Products').then(
      response => {
        setProductsList(response.data);
      }
    )
  });

  return (
    <div className='main'>
      <DataTable
        title="Lista produktów"
        columns={columns}
        data={productsList}
      />
      <div className='btn-panel'>
        <a href={'/Products/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(5.2)'}} />
        </a>
      </div>
    </div>
  );
}
export default Products