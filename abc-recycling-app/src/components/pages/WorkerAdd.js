import React, { useEffect } from 'react'
import { useState } from "react";
import Axios from "../../request";
import { ImCancelCircle} from 'react-icons/im'
import {Link} from 'react-router-dom';
import { useParams, useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function WorkerAdd() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [rolesList, setRolesList] = useState([]);

  const {id} = useParams();
  const navigate = useNavigate();
  let isAddMode = ({id}.id === undefined ? true : false);

  const [inputValue, setInputValue] = React.useState('');

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
        <h1>Dodaj pracownika</h1>
        <form className='simpleForm'>
            <label>Imię</label>
            <input type="text" id="name" name="name" onChange={(event) => {
                setName(event.target.value);
            }}>
            </input>
            <label>Nazwisko</label>
            <input type="text" id="surname" name="surname" onChange={(event) => {
                setSurname(event.target.value);
            }}>
            </input>
            <label>Numer dowodu</label>
            <input type="text" id="idNumber" name="idNumber" onChange={(event) => {
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
                // value={value}
                // onChange={(event, newValue) => {
                //   setValue(newValue);
                // }}
                // inputValue={inputValue}
                // onInputChange={(event, newInputValue) => {
                //     setInputValue(newInputValue);
                // }}
                // id="controllable-states-demo"
                // options={option}
                // sx={{ width: 300 }}
                // renderInput={(params) => <TextField {...params} label="Rola" />}
              />
            </div>
              
            
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
