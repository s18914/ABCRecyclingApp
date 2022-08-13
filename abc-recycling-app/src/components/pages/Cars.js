import React, { useEffect, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import FilterComponent from "../FilterComponent";


const Cars = props => {

  const [carsList, setCarsList] = useState([]);
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
      selector: row => row.car_id,
    },
    {
      name: 'Numer rejestracyjny',
      selector: row => row.registration_number,
    },
    {
      name: 'Data wazności przeglądu',
      selector: row => row.overview_date,
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <Link to={`/cars/edit/${row.car_id}`}>
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
              onClick={() => deleteCar(row.car_id)}
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
    }
  ];

  const filteredItems = carsList.filter(
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

  const deleteCar = (car_id) => {
    Axios.delete(`/carDelete/${car_id}`).then((response) => {
      setCarsList(
        carsList.filter((row) => {
          return row.car_id !== car_id;
        })
      );
    });
  };

  useEffect(() => {
    Axios('/cars').then(
      response => {
        setCarsList(response.data);
      }
    )
  }, []);

  return (
    <div className='main'>
      <DataTable
        title="Lista samochodów"
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
        <Link to={'/cars/add'}>
          <AiOutlinePlusSquare style={{ color: 'grey', cursor: 'pointer', transform: 'scale(5.2)' }} />
        </Link>
      </div>
    </div>
  );
}

export default Cars