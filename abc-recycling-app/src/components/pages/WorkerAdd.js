import React, { useEffect } from 'react'
import { useState } from "react";
import Axios from "../../request";
import { useParams, useNavigate } from 'react-router';
import { ImCancelCircle} from 'react-icons/im'
import {Link} from 'react-router-dom';
import { useParams, useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FaCheckCircle } from 'react-icons/fa'


function WorkerAdd() {
  const [worker, setWorker] = useState();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [idNumber, setIdNumber] = useState(0);
  const [roleId, setRoleId] = useState(0);
  const [rolesList, setRolesList] = useState([]);

  const {id} = useParams();
  const navigate = useNavigate();
  let isAddMode = ({id}.id === undefined ? true : false);

  // const getWorker = (id) => {
  //   if(!isAddMode) {
  //     Axios.get(`/worker/${id}`).then((response) => {
  //       setWorker(response.data);
  //       setName(response.data?.name);
  //       setSurname(response.data?.surname);
  //       setIdNumber(response.data?.idNumber);
  //     });
  //   }
  // };

  // useEffect(() => {
  //   getWorker({id}.id);
  // }, []);

  const addWorker = (event) => {
    event.preventDefault();
    Axios.post('/workerCreate', {
      name: name, 
      surname: surname, 
      idNumber: idNumber,
      roleId: roleId
    }).then((data) => {
      console.log("success", data.data);
      navigate("/workers");
      console.log(idNumber)
    })
  };

  const findOptions = () => {
    Axios('/roles').then(
      response => {
        setRolesList(response.data);
      }
    )
  };

  return (
    <div className='main' >
      {isAddMode &&<h1>Dodaj nowego pracownika</h1>}
      {!isAddMode && <h1>Edytuj pracownika</h1>}
        <form className='simpleForm'>
            <label>Imię</label>
            <input type="text" id="name" name="name" defaultValue={worker?.name} 
            onChange={(event) => {
                setName(event.target.value);
            }}>
            </input>
            <label>Nazwisko</label>
            <input type="text" id="surname" name="surname" defaultValue={worker?.surname} 
            onChange={(event) => {
                setSurname(event.target.value);
            }}>
            </input>
            <label>Numer dowodu</label>
            <input type="text" id="id" name="id" defaultValue={worker?.idNumber} 
            onChange={(event) => {
                setIdNumber(event.target.value);
            }}>
            </input>
            <label>Rola</label>
            <div>
            <br />
            <div onClick={findOptions}>
              <Autocomplete
                id="rolesLookup"
                defaultValue={worker?.roleId} 
                options={rolesList}
                onChange={(value) => {
                  setRoleId(value.id);
                  //console.log(value.id);
                }}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Rola" />}
              />
            </div>
            </div>
          <div className='btn-panel' style={{transform: 'scale(4.0)'}}>
            {isAddMode && <FaCheckCircle onClick={addWorker} style={{color: 'green', cursor: 'pointer'}}/>}
            {!isAddMode && <FaCheckCircle style={{color: 'green', cursor: 'pointer'}} />}
          </div>
        </form>
      <div className='btn-panel'>
        <Link to={'/workers'}>
          <ImCancelCircle style={{color: 'grey', cursor: 'pointer', padding: '0 15px'}} onClick={() => {navigate("/workers")}}/>
          <button onClick={addWorker}>
            Zatwierdź
          </button>
        </Link> 
        <Link to={'/workers'}>
          <button>
            Anuluj
          </button>
        </Link> 
      </div>
    </div>
  )
}

export default WorkerAdd
