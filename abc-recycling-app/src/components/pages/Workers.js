import React, { useEffect, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import FilterComponent from "../FilterComponent";


const Workers = props => {

  const [workersList, setWorkersList] = useState([]);
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const paginationComponentOptions = {
    rowsPerPageText: 'Rekordów na stronie',
    rangeSeparatorText: 'z',
  };
  const columns = [
    {
      name: 'Id',
      width: '60px',
      sortable: true,
      selector: row => row.worker_id,
    },
    {
      name: 'Imię',
      width: '200px',
      sortable: true,
      selector: row => row.name,
    },
    {
      name: 'Nazwisko',
      width: '200px',
      sortable: true,
      selector: row => row.surname,
    },
    {
      name: 'Numer dowodu',
      width: '200px',
      sortable: true,
      selector: row => row.id_number,
    },
    {
      name: 'Rola',
      width: '200px',
      sortable: true,
      selector: row => row.role_name,
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <Link to={`/Workers/edit/${row.worker_id}`}>
          <FaPen
            style={{ color: 'grey', cursor: 'pointer', transform: 'scale(1.4)' }}
          />
        </Link>
      )
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => {
        if (row.can_delete === '1') {
          return (
            <FaTimes
              style={{ color: '#D83232', cursor: 'pointer', transform: 'scale(1.5)' }}
              onClick={() => deleteWorker(row.worker_id)}
            />
          );
        } else {
          return (
            <FaTimes
              style={{ color: 'grey', cursor: 'pointer', transform: 'scale(1.5)' }}
            />
          );
        }
      }
    },
  ];

  const deleteWorker = (worker_id) => {
    Axios.delete(`/workerDelete/${worker_id}`).then((response) => {
      setWorkersList(
        workersList.filter((row) => {
          return row.worker_id !== worker_id;
        })
      );
    });
  };

  useEffect(() => {
    Axios('/workers').then(
      response => {
        setWorkersList(response.data);
      }
    )
  }, []);

  const filteredItems = workersList.filter(
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


  return (
    <div className='main'>
      <DataTable
        title="Lista pracowników"
        columns={columns}
        data={filteredItems}
        noDataComponent='brak rekordów'
        pagination
        paginationComponentOptions={paginationComponentOptions}
        striped
        subHeader
        subHeaderComponent={subHeaderComponent}
      />
      <div className='btn-panel'>
        <Link to={'/workers/add'}>
          <AiOutlinePlusSquare style={{ color: 'grey', cursor: 'pointer', transform: 'scale(5.2)' }} />
        </Link>
      </div>
    </div>
  );
}
export default Workers