import { useState, useEffect} from "react";
import Axios from "../../request";
import {Link} from 'react-router-dom';
import { FaCheckCircle} from 'react-icons/fa'
import { useParams } from "react-router-dom";

function SaleAdd() {
  
  let { id } = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);

  return (
    <div className='main'>
      {isAddMode &&<h1>Dodaj nowy dokument sprzedaży</h1>}
      {!isAddMode && <h1>Edytuj dokument sprzedaży</h1>}
      <form>
        <label>Wybierz klienta</label>
        <input type="text" id="nip" name="nip" placeholder="Kontrahent" 
            >
        </input>
        <label>Dodaj towary:</label>
        <input type="text" id="account_number" name="account_number" placeholder="Nr konta..">
        </input>
        <label>Dodaj transport: </label>
        <input type="text" id="email" name="email" placeholder="E-mail.." >
        </input>
        <Link className='btn-panel' to="/sales" style={{transform: 'scale(4.0)'}}>
            {isAddMode && <FaCheckCircle style={{color: 'green', cursor: 'pointer'}}/>}
            {!isAddMode && <FaCheckCircle  style={{color: 'green', cursor: 'pointer'}}/>}
        </Link>
        </form>
    </div>
  )
}

export default SaleAdd