import React from 'react'
import { useState, useEffect} from "react";
import Axios from "axios";
import { FaCheckCircle } from 'react-icons/fa'
import { useParams } from "react-router-dom";

function CustomerAdd() {
  
  let { id } = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);
  
  const [customer, setCustomer] = useState();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [idnumber, setIdNumber] = useState("");

  const getCustomer = (id) => {
    if(!isAddMode) {
      Axios.get(`http://localhost:3001/customer/${id}`).then((response) => {
        setCustomer(response.data);
      });
    }
  };

  useEffect(() => {
    getCustomer({id}.id);
  }, []);
  
  const addCustomer = (event) => {
    event.preventDefault();
    Axios.post('http://localhost:3001/customerCreate', {
      name: name, 
      surname: surname, 
      idnumber: idnumber
    }).then((data) => {
      console.log("success", data.data);
    })
  };

  const updateCustomer = () => {
    Axios.put('http://localhost:3001/customerUpdate', {
      name: name, 
      surname: surname,
      idnumber: idnumber,
      id: {id}.id
    }).then((response) => {
      alert("update");
    });
  };

  const deleteCustomer =  (id) => {
    Axios.delete(`http://localhost:3001/customerDelete/${id}`);
  }

  return (
    <div className='main'>
      {isAddMode && <h1>Dodaj nowego klienta</h1>}
      {!isAddMode && <h1>Edytuj klienta</h1>}
      <form>
        <label>Wpisz imię</label>
        <input type="text" id="name" name="name" placeholder="Imię.." defaultValue={customer?.name}
          onChange={(event) => {
            setName(event.target.value);
          }}>
        </input>
        <label>Wpisz nazwisko</label>
        <input type="text" id="surname" name="surname" placeholder="Nazwisko.." defaultValue={customer?.surname} onChange={(event) => {
            setSurname(event.target.value);
          }}>
        </input>
        <label>Wpisz numer dowodu</label>
        <input type="text" id="idnumber" name="idnumber" placeholder="Numer dowodu.." defaultValue={customer?.idnumber} onChange={(event) => {
            setIdNumber(event.target.value);
          }}>
        </input>
        <div className='btn-panel'>
          {isAddMode && <FaCheckCircle onClick={addCustomer} style={{color: 'green', cursor: 'pointer', transform: 'scale(4.0)'}}/>}
          {!isAddMode && <FaCheckCircle onClick={updateCustomer} style={{color: 'green', cursor: 'pointer', transform: 'scale(4.0)'}}/>}
        </div>
      </form>
    </div>
  )
}

export default CustomerAdd