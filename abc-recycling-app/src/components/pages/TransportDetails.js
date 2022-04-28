import React from 'react'
import Axios from "axios";

function TransportDetails() {

  return (
    <div className='main'>
      <h1>Szczegóły transportu</h1>
      <form>
        <label>Data</label>
        <input type="text" id="date" name="date" placeholder="data" disabled="true"/>
        <label>Telefon odbiorcy</label>
        <input type="text" id="phone" name="phone" placeholder="Telefon.." disabled="true" />
        <label>Adres</label>
        <input type="text" id="address" name="address" placeholder="Adres.." disabled="true" />
      </form>
      <div className='btn-panel'>
        <a href={'/transports'}>
            <button>Powrót</button>
        </a>
      </div>
    </div>
  )
}

export default TransportDetails