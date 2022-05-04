import React from 'react'
import { useState } from "react";
import Axios from "axios";
import { useParams } from 'react-router';

function TransportAdd() {
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const {id} = useParams();

  const addTransport = (event) => {
    event.preventDefault();
    Axios.post('http://localhost:3001/transportCreate', {
      date: date, 
      phone: phone, 
      address: address
    }).then((data) => {
      console.log("success", data.data);
    })
  };

  return (
    <div className='main'>
      <h1>Dodaj nowy transport</h1>
      <form>
        <label>Wybierz datę</label>
        <input type="text" id="date" name="date" placeholder="Data.."
          onChange={(event) => {
            setDate(event.target.value);
          }}>
        </input>
        <label>Wpisz telefon odbiorcy</label>
        <input type="text" id="phone" name="phone" placeholder="Telefon.." onChange={(event) => {
            setPhone(event.target.value);
          }}>
        </input>
        <label>Wpisz adres</label>
        <input type="text" id="address" name="address" placeholder="Adres.." onChange={(event) => {
            setAddress(event.target.value);
          }}>
        </input>
        <label>Wybierz ciężarówkę</label>
        {/* <select>
          <option value="Ford 1">ford XYUD825</option>
          <option value="Ford 2">ford XZUD825</option>
        </select> */}
      </form>
      <div className='btn-panel'>
        <a href={'/transports'}>
          <button onClick={addTransport}>
            Zatwierdź
          </button>
        </a> 
        <a href={'/transports'}>
          <button>
            Anuluj
          </button>
        </a> 
      </div>
    </div>
  )
}

export default TransportAdd