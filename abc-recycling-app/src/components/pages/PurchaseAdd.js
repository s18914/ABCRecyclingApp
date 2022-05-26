import { useState, useEffect} from "react";
import Axios from "axios";
import { FaCheckCircle} from 'react-icons/fa'
import { useParams } from "react-router-dom";

function PurchaseAdd() {
  
  let { id } = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);

  return (
    <div className='main'>
      {isAddMode &&<h1>Dodaj nowy dokument zakupu</h1>}
      {!isAddMode && <h1>Edytuj dokument zakupu</h1>}
      <form>
        <label>Wybierz klienta</label>
        <input type="text" id="nip" name="nip" placeholder="Kontrahent" 
            >
        </input>
        {isAddMode && 
          <label>Dodaj towary:</label> 
        }
        
        <label>Dodaj transport: </label>
        <input type="text" id="email" name="email" placeholder="E-mail.." >
        </input>
        <div className='btn-panel' style={{transform: 'scale(4.0)'}}>
            {isAddMode && <FaCheckCircle style={{color: 'green', cursor: 'pointer'}}/>}
            {!isAddMode && <FaCheckCircle  style={{color: 'green', cursor: 'pointer'}}/>}
        </div>
        </form>
    </div>
  )
}

export default PurchaseAdd