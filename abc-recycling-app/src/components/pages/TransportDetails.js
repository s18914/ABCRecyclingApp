import React from 'react'
import Axios from "axios";

function TransportEdit() {
    
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
      {/* <div className='btn-panel'>
          <button onClick={getTransport}>Pokaż transporty</button>
          <ol>
          {transportList.map((val, key) => {
            return ( 
            <li key={val.transport_id}> 
              <div> Id: {val.transport_id} </div>
              <div> Telefon: {val.phone} </div>
              <div> Data: {val.date} </div>
              <div> Adres: {val.address} </div>
              <button title="DELETE" onClick={() => {
                deleteTransport(val.transport_id);
              }} > 
              </button>
            </li> 
            )
          })}
          </ol>
        </div> */}
    </div>
  )
}

export default TransportEdit