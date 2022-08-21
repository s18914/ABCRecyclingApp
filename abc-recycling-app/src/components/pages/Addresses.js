import React, { useEffect, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import { useState } from "react";
import Axios from "../../request";
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import FilterComponent from "../FilterComponent";
import { useNavigate } from "react-router-dom";

const Addresses = props => {

  const [addressesList, setAddressesList] = useState([]);
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const navigate = useNavigate();
  const paginationComponentOptions = {
    rowsPerPageText: 'Rekordów na stronie',
    rangeSeparatorText: 'z',
  };
  const columns = [
    {
      name: 'No.',
      width: '90px',
      sortable: true,
      selector: row => row.address_id,
    },
    {
      name: 'Ulica:',
      sortable: true,
      selector: row => row.street,
    },
    {
      name: 'Numer domu',
      sortable: true,
      selector: row => row.house_number,
    },
    {
      name: 'Numer lokalu',
      sortable: true,
      selector: row => row.flat_number,
    },
    {
      name: 'Miasto',
      sortable: true,
      selector: row => row.city,
    },
    {
      name: 'Województwo',
      sortable: true,
      selector: row => row.province,
    },
    {
      name: "",
      button: true,
      width: '60px',
      cell: row => (
        <Link to={`/address/edit/${row.address_id}`}>
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
              onClick={() => deleteaddress(row.address_id)}
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

  Axios.defaults.withCredentials = true;

  const deleteaddress = (address_id) => {
    Axios.delete(`/addressDelete/${address_id}`).then((response) => {
      setAddressesList(
        addressesList.filter((row) => {
          return row.address_id !== address_id;
        })
      );
    });
  };

  useEffect(() => {
    Axios.get("/login").then((response) => {
      if (response.data.loggedIn !== true) {
        navigate("/login");
      }
    });

    Axios('/addresses').then(
      response => {
        setAddressesList(response.data);
      }
    )
  }, []);

  const filteredItems = addressesList.filter(
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
        title="Lista adresów"
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
        <Link to={'/address/add'}>
          <AiOutlinePlusSquare style={{ color: 'grey', cursor: 'pointer', transform: 'scale(5.2)' }} />
        </Link>
      </div>
    </div>
  );
}

export default Addresses