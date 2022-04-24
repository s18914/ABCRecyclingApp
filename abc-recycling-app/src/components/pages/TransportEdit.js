import React from 'react'
import Button from '../Button'
import { useState } from "react";
import Axios from "axios";

function TransportEdit() {
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const addTransport = () => {
    console.log(date);
    Axios.post('http://localhost:3001/transportCreate', {
      date: date, 
      phone: phone, 
      address: address
    }).then(() => {
      console.log("success");
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
        <div className='btn-panel'>
          <button onClick={addTransport}>Dodaj</button>
        </div>
      </form>
    </div>
  )
}

export default TransportEdit