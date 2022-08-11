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
  const [ref, setRef] = useState(1);
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const paginationComponentOptions = {
    rowsPerPageText: 'Rekordów na stronie',
    rangeSeparatorText: 'z',
  };

  let d = new Date();

  const columns =  [
    {
      name: 'No.',
      width: '90px',
      sortable: true,
      selector: row => row.sales_id,
    },
    {
      name: 'Kontrahent',
      width: '200px',
      sortable: true,
      selector: row => row.name,
    },
    {
      name: 'Cena',
      width: '80px',
      sortable: true,
      selector: row => row.price,
    },
    {
      name: 'Adres',
      width: '200px',
      sortable: true,
      padding: '0',
      cell: row => {
        if (row.transport_info === 'Nieustalony') {
          return (
            <Link to={`/sales/edit/${row.sales_id}`} style={{textDecoration: 'none'}}>
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
      width: '120px',
      sortable: true,
      selector: row => row.date === null ? row.date : row.date.substring(0, 10),
      conditionalCellStyles: [
        {
            when: row => row.date !== null && fn_DateCompare(row.date, d) !== 1 && row.status_id < 3,
            style: {
                backgroundColor: '#B22222',
                color: 'white',
            },
        },
      ],
    },
    {
      name: 'Status wysyłki',
      width: '130px',
      sortable: true,
      selector: row => row.status,
      conditionalCellStyles: [
        {
            when: row => row.status_id < 1,
            style: {
                backgroundColor: '#00BFFF',
                color: 'white',
            },
        },
        {
            when: row => row.status_id >=1 && row.status_id < 2,
            style: {
                backgroundColor: 'rgba(248, 148, 6, 0.9)',
                color: 'white',
            },
        },
        {
            when: row => row.status_id >= 2,
            style: {
                backgroundColor: 'rgba(63, 195, 128, 0.9)',
                color: 'white',
            },
        },
      ],
    },
    {
      name: "Zmień status",
      button: true,
      width: '140px',
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
              }}
            />
          );
        } else {
          return (
            <GiReceiveMoney
              style={{color: 'grey', cursor: 'pointer', transform: 'scale(1.8)'}}
              onClick={() => {
                setPayment(row.sales_id, 1);
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
      setRef(Math.random());
    });
  };

  const prevStatus =  (id, status) => {
    Axios.put('/SaleUpdateStatus', {
      id: id,
      status_id: --status
    }).then((response) => {
      setRef(Math.random());
    });
  };

  const setPayment =  (id, val) => {
    Axios.put('/SaleUpdatePayment', {
      id: id,
      val: val
    }).then((response) => {
      setRef(Math.random());
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

  function fn_DateCompare(DateA, DateB) {

    var a = new Date(DateA);
    var b = new Date(DateB);

    var msDateA = Date.UTC(a.getFullYear(), a.getMonth()+1, a.getDate());
    var msDateB = Date.UTC(b.getFullYear(), b.getMonth()+1, b.getDate());

    if (parseFloat(msDateA) < parseFloat(msDateB))
      return -1;  // lt
    else if (parseFloat(msDateA) == parseFloat(msDateB))
      return 0;  // eq
    else if (parseFloat(msDateA) > parseFloat(msDateB))
      return 1;  // gt
    else
      return null;  // error
}

  useEffect(() => {
    Axios('/sales').then(
      response => {
        setSaleList(response.data.filter(e => e.name !== 'ROBOCZY'));
        setDocId(response.data?.sales_id);
      }
    )
  }, [docId, ref]);

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
        defaultSortFieldId={1}
        defaultSortAsc={false}
        striped
        subHeader
        subHeaderComponent={subHeaderComponent}
      />
      <div className='btn-panel-small'>
        <Link to={'/sales/add'}>
          <AiOutlinePlusSquare style={{color: 'grey', cursor: 'pointer', transform: 'scale(2.0)'}} />
        </Link>
      </div>
      <ProductsOfDocument id={docId} refresh={setRef}/>
    </div>
  );
}

export default Sales