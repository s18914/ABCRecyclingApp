import React from 'react'
import { useState } from "react";
import Axios from "axios";
import { FaCheckCircle } from 'react-icons/fa'

function CustomerAdd() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [IdNumber, setIdNumber] = useState("");

  const addCustomer = (event) => {
    event.preventDefault();
    Axios.post('http://localhost:3001/customerCreate', {
      name: name, 
      surname: surname, 
      IdNumber: IdNumber
    }).then((data) => {
      console.log("success", data.data);
    })
  };

  const updateCustomer = (id) => {
    Axios.put('http://localhost:3001/customerUpdate', {
      name: name, 
      surname: surname,
      IdNumber: IdNumber,
      id: id
    }).then((response) => {
      alert("update");
    });
  };

  const deleteCustomer =  (id) => {
    Axios.delete('http://localhost:3001/customerDelete/${id}');
  }

  return (
    <div className='main'>
      <h1>Dodaj nowego klienta</h1>
      <form>
        <label>Wybierz imię</label>
        <input type="text" id="name" name="name" placeholder="Imię.."
          onChange={(event) => {
            setName(event.target.value);
          }}>
        </input>
        <label>Wpisz nazwisko</label>
        <input type="text" id="surname" name="surname" placeholder="Nazwisko.." onChange={(event) => {
            setSurname(event.target.value);
          }}>
        </input>
        <label>Wpisz numer dowodu</label>
        <input type="text" id="IdNumber" name="IdNumber" placeholder="Numer dowodu.." onChange={(event) => {
            setIdNumber(event.target.value);
          }}>
        </input>
        <div className='btn-panel'>
          <FaCheckCircle onClick={addCustomer} style={{color: 'green', cursor: 'pointer', transform: 'scale(4.0)'}}/>
        </div>
      </form>
    </div>
  )
}

export default CustomerAdd