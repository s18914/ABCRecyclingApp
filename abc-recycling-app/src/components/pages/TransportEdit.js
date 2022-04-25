import React from 'react'
import Button from '../Button'
import { useState } from "react";
import Axios from "axios";

function TransportEdit() {
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [newPhone, setNewPhone] = useState(0);

  const [transportList, setTransportList] = useState([]);

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

  const getTransport = () => {
    Axios.get('http://localhost:3001/transports').then((response) => {
      setTransportList(response.data);
      //console.log(response.data);
    });
  };

  const updateTransport = (id) => {
    Axios.put('http://localhost:3001/transportUpdate', {
      phone: newPhone, 
      id: id
    }).then((response) => {
      alert("update");
    });
  };
console.log(transportList);
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
      <div className='btn-panel'>
          <button onClick={getTransport}>Pokaż transporty</button>
          <ol>
          {transportList.map((val, key) => {
            return <li key={val.transport_id}> {val.phone} </li> 
          })}
          </ol>
        </div>
    </div>
  )
}

export default TransportEdit