import React from 'react';
import Axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from 'react-router';

function TransportDetails() {
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

  return (
    <div className='main'>
      <h1>Szczegóły transportu</h1>
      {transport?
      <form>
        <label>Data</label>
        <input type="text" id="date" name="date" defaultValue={transport?.date} disabled={true}/>
        <label>Telefon odbiorcy</label>
        <input type="text" id="phone" name="phone" defaultValue={transport?.phone} disabled={true} />
        <label>Adres</label>
        <input type="text" id="address" name="address" defaultValue={transport?.address} disabled={true} />
      </form>
      :<div>Loading</div>
      }
      <div className='btn-panel'>
        <a href={'/transports'}>
            <button>Powrót</button>
        </a>
      </div>
    </div>
  )
}

export default TransportDetails