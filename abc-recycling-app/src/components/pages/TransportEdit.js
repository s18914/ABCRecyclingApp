import React from 'react';
import { useState, useEffect } from "react";
import Axios from "axios";
import { useParams } from 'react-router';

function TransportEdit() {
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [newDate, setNewDate] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const [transportList, setTransportList] = useState([]);
  
  const [transport, setTransport] = useState();

  const {id} = useParams();

  const getTransport = (id) => {
    Axios.get(`http://localhost:3001/transport/${id}`).then((response) => {
      setTransport(response.data);
      console.log(response.data);
    });
  };
  //console.log(transport);

  useEffect(() => {
    getTransport(id);
  }, []);

  const updateTransport = (id) => {
    Axios.put(`http://localhost:3001/TransportEdit/${id}`, {
      phone: newPhone, 
      address: newAddress,
      date: newDate,
      id: id
    }).then((response) => {
      alert("update");
    });
  };


//console.log(transportList);
  return (
    <div className='main'>
      <h1>Edycja transportu</h1>
      <form>
        <label>Data</label>
        <input type="text" id="date" name="date" defaultValue={transport?.date}
          onChange={(event) => {
            setNewDate(event.target.value);
          }}>
        </input>
        <label>Telefon odbiorcy</label>
        <input type="text" id="phone" name="phone" defaultValue={transport?.phone}
        onChange={(event) => {
            setNewPhone(event.target.value);
          }}>
        </input>
        <label>Adres</label>
        <input type="text" id="address" name="address" defaultValue={transport?.address}
         onChange={(event) => {
            setNewAddress(event.target.value);
          }}>
        </input>
      </form>
      <div className='btn-panel'>
        <a href={'/transports'}>
          <button onClick={updateTransport}>
            Zatwierdź
          </button>
        </a>
      </div>
      <div className='btn-panel'>
          <button onClick={getTransport}>Pokaż transporty</button>
          <ol>
          {transportList.map((val, key) => {
            return ( 
            <li key={val.transport_id}> 
              <div> Id: {val.transport_id} </div>
              <div> Telefon: {val.phone} </div>
              <div> Data: {val.date} </div>
              <div> Adres: {val.address} </div>
              {/* <div>
              <input 
              type='text' 
              placeholder='zmien nr telefonu'
              onChange={(event) => {
                setNewPhone(event.target.value);
              }}
              />
              <button onClick={()=>{updateTransport(val.transport_id)}}>
                update
              </button>
              </div> */}
            </li> 
            )
          })}
          </ol>
        </div>
    </div>
  )
}

export default TransportEdit