import React, { useEffect } from 'react'
import { useState } from "react";
import Axios from "../../request";
import { useParams } from 'react-router';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FaCheckCircle } from 'react-icons/fa'

function WorkerAdd() {
  const [worker, setWorker] = useState();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [rolesList, setRolesList] = useState([]);

  const {id} = useParams();
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
      idNumber: idNumber
    }).then((data) => {
      console.log("success", data.data);
    })
  };

  const findOptions = () => {
    Axios('/roles').then(
      response => {
        setRolesList(response.data);
        console.log(response.data);
      }
    )
  };

  return (
    <div className='main' >
      {isAddMode &&<h1>Dodaj nowego pracownika</h1>}
      {!isAddMode && <h1>Edytuj pracownika</h1>}
        <form>
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
            <input type="text" id="idNumber" name="idNumber" defaultValue={worker?.idNumber} 
            onChange={(event) => {
                setIdNumber(event.target.value);
            }}>
            </input>
            <label>Rola</label>
            <div>
            <br />
            <div onClick={findOptions}>
              <Autocomplete
                id="grouped-demo"
                options={rolesList}
                getOptionLabel={(option) => option.label}
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
    </div>
  )
}

export default WorkerAdd
