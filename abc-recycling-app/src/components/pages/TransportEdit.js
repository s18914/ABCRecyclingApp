import React from 'react';
import { useState, useEffect } from "react";
import Axios from "../../request";
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
    Axios.get(`/transport/${id}`).then((response) => {
      setTransport(response.data);
      console.log(response.data);
    });
  };
  //console.log(transport);

  useEffect(() => {
    getTransport(id);
  }, []);

  const updateTransportPhone = (id) => {
    Axios.put(`/transportEditPhone`, {
      phone: newPhone,
      id: id
    }).then((response) => {
      setTransportList(transportList.map((val) => {
        return val.transport_id = id ? {id: val.transport_id, address: val.address, date: val.date, phone: newPhone} : val
      }));
    });
  };

  const updateTransportAddress = (id) => {
    Axios.put(`/transportEditAddress`, {
      address: newAddress,
      id: id
    }).then((response) => {
      setTransportList(transportList.map((val) => {
        return val.transport_id = id ? {id: val.transport_id, date: val.date, phone: val.phone, address: newAddress} : val
      }));
    });
  };

  const updateTransportDate = (id) => {
    Axios.put(`/transportEditDate`, {
      date: newDate,
      id: id
    }).then((response) => {
      setTransportList(transportList.map((val) => {
        return val.transport_id = id ? {id: val.transport_id, address: val.address, phone: val.phone, date: newDate} : val
      }));
    });
  };


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
      <a href={'/transports'} onClick={() => {
        updateTransportPhone(transport.transport_id); 
        updateTransportAddress(transport.transport_id);
        updateTransportDate(transport.transport_id);
      }}>Zatwierdź(poprawić)</a>
        {/* <a href={'/transports'}>
          <button onClick={()=>{updateTransportPhone(transport.transport_id)}}>
            Zatwierdź
          </button>
        </a> */}
        <a href={'/transports'}>
          <button>
            Anuluj
          </button>
        </a> 
      </div>
    </div>
  )
}

export default TransportEdit