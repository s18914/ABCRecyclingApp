import React, { useEffect, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import {Link} from 'react-router-dom';
import ProductsOfDocument from './ProductsOfDocument';
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'
import FilterComponent from "../FilterComponent";
import { useNavigate } from "react-router-dom";

const Purchases = props => {

  const [purchaseList, setPurchaseList] = useState([]);
  const [docId, setDocId] = useState(0);
  const paginationComponentOptions = {
    rowsPerPageText: 'Rekordów na stronie',
    rangeSeparatorText: 'z',
  };
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const [ref, setRef] = useState(1);
  Axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const columns =  [
    {
      name: 'No.',
      width: '90px',
      sortable: true,
      selector: row => row.purchase_id,
    },
    {
      name: 'Kontrahent',
      width: '280px',
      sortable: true,
      selector: row => row.name,
    },
    {
        name: 'Cena',
        width: '100px',
        sortable: true,
        selector: row => row.price,
    },
    {
      name: 'Adres',
      width: '220px',
      sortable: true,
      padding: '0',
      cell: row => {
        if (row.transport_info === 'Nieustalony') {
          return (
            <Link to={`/purchases/edit/${row.purchase_id}`} style={{textDecoration: 'none'}}>
              <div
              style={{backgroundColor: '#41B53D', color: 'white', cursor: 'pointer', width: '120px', textAlign: 'center', fontWeight: '600', borderRadius: '3px', padding: '0'}}
              >+</div>
            </Link>
          );
        } else {
          return (
            row.transport_info
          );
        }
      },
    },
    {
      name: 'Data',
      width: '140px',
      sortable: true,
      selector: row => row.date === null ? row.date : row.date.substring(0, 10),
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

  const filteredItems = purchaseList.filter(
    item =>
      JSON.stringify(Object.values(item))
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) !== -1
  );

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={e => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      console.log(response.data.loggedIn)
      if (response.data.loggedIn !== true) {
        navigate("/login");
      }
    });

    Axios('/purchases').then(
      response => {
        setPurchaseList(response.data.filter(e => e.name !== 'ROBOCZY'));
        setDocId(response.data?.document_id);
      }
    )
  }, [docId]);

  return (
    <div className='main'>
      <DataTable
        title="Lista zakupów"
        columns={columns}
        data={filteredItems}
        noDataComponent='brak rekordów'
        onRowClicked={(row, event) => {
          setDocId(row.purchase_id);
        }}
        defaultSortFieldId={1}
        defaultSortAsc={false}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        striped
        subHeader
        subHeaderComponent={subHeaderComponent}
      />
      <div className='btn-panel-small'>
        <Link to={'/purchases/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(2.2)'}} />
        </Link>
      </div>
      <ProductsOfDocument id={docId} refresh={setRef}/>
    </div>
  );
}

export default Purchases