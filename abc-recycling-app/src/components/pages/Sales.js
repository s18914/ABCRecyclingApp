import React, { useEffect, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import {Link} from 'react-router-dom';
import ProductsOfDocument from './ProductsOfDocument';
import {IoArrowBack, IoArrowForward} from 'react-icons/io5' 
import {FaTimes, FaPen} from 'react-icons/fa'
import {AiOutlinePlusSquare} from 'react-icons/ai'
import {GiReceiveMoney} from 'react-icons/gi'
import FilterComponent from "../FilterComponent";

const Sales = props => {
  
  const [saleList, setSaleList] = useState([]);
  const [docId, setDocId] = useState(0);
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const paginationComponentOptions = {
    rowsPerPageText: 'Rekordów na stronie',
    rangeSeparatorText: 'z',
  };
  const columns =  [
    {
      name: 'No.',
      width: '60px',
      selector: row => row.sales_id,
    },
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
            <Link to={`/sales/edit/${row.sales_id}`}>
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
      width: '100px',
      selector: row => row.date,
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
              onDoubleClick={() => {
                setPayment(row.sales_id, 0);
                setDocId(0);
              }}
            />
          );
        } else {
          return (
            <GiReceiveMoney
              style={{color: 'grey', cursor: 'pointer', transform: 'scale(1.8)'}}
              onClick={() => {
                setPayment(row.sales_id, 1);
                setDocId(0);
              }}
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
        <Link to={`/sales/edit/${row.sales_id}`}>
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
            onClick={() => deleteSale(row.sales_id)}
        />
      )
    },
  ];
  
  const deleteSale =  (id) => {
    Axios.delete(`/documentDelete/${id}`).then((response) => {
      setSaleList(
        saleList.filter((row) => {
          return row.sales_id !== id;
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

  const filteredItems = saleList.filter(
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
    Axios('/sales').then(
      response => {
        setSaleList(response.data);
        setDocId(response.data?.sales_id);
      }
    )
  }, [docId]);

  return (
    <div className='main'>
      <DataTable
        title="Lista sprzedaży"
        columns={columns}
        data={filteredItems}
        noDataComponent='brak rekordów'
        onRowClicked={(row, event) => {
          setDocId(row.sales_id);
        }}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        striped
        subHeader
        subHeaderComponent={subHeaderComponent}
      />
      <div className='btn-panel-small'>
        <Link to={'/sales/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(2.0)'}} />
        </Link>
      </div>
      <ProductsOfDocument id={docId} refresh={setDocId}/>
    </div>
  );
}

export default Sales