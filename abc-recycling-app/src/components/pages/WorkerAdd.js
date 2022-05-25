import React, { useEffect } from 'react'
import { useState } from "react";
import Axios from "axios";
import { useParams } from 'react-router';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function WorkerAdd() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [rolesList, setRolesList] = useState([]);
  let rolesToSting = rolesList.toString;

  const option = ['Magazynier', 'Kierowca'];

  const {id} = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);

  const [value, setValue] = React.useState(rolesList[0]);
  const [inputValue, setInputValue] = React.useState('');

  const addWorker = (event) => {
    event.preventDefault();
    Axios.post('http://localhost:3001/workerCreate', {
      name: name, 
      surname: surname, 
      idNumber: idNumber
    }).then((data) => {
      console.log("success", data.data);
    })
  };

  useEffect(() => {
    Axios('http://localhost:3001/roles').then(
      response => {
        setRolesList(response.data);
      }
    )
  });

  return (
    <div className='main' onSubmit={console.dir(rolesList)}>
        <h1>Dodaj pracownika</h1>
        <form>
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
            <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                id="controllable-states-demo"
                options={option}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Rola" />}
            />
            </div>
        </form>
      <div className='btn-panel'>
        <a href={'/workers'}>
          <button onClick={addWorker}>
            Zatwierdź
          </button>
        </a> 
        <a href={'/workers'}>
          <button>
            Anuluj
          </button>
        </a> 
      </div>
    </div>
  )
}

export default WorkerAdd
