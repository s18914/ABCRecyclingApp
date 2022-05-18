import React from 'react';
import { useState } from "react";
import Axios from "axios";
import { useParams } from 'react-router';

function WorkerAdd() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [idNumber, setIdNumber] = useState("");

  const {id} = useParams();

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

  return (
    <div className='main'>
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
