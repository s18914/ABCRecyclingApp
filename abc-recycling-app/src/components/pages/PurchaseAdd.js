import { useState, useEffect} from "react";
import Axios from "../../request";
import { FaCheckCircle} from 'react-icons/fa'
import { useParams } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function PurchaseAdd() {
  
  let { id } = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);
  const [customersList, setCustomersList] = useState([]);
  const [transportsList, setTransportsList] = useState([]);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    let id = 1000;
    if(id !== undefined) {
      Axios.get(`/documentProducts/${id}`).then(
        response => {
          setProductList(
            JSON.parse(JSON.stringify(response.data))
          );
        }
      )
    }
  }); 

  const findCustomers = () => {
    Axios('/CompaniesLookup').then(
      response => {
        setCustomersList(response.data);
      }
    )
  };

  const findTransports = () => {
    Axios('/TransportsLookup').then(
      response => {
        setCustomersList(response.data);
      }
    )
  };



  return (
    <div className='main'>
      {isAddMode &&<h1>Dodaj nowy dokument zakupu</h1>}
      {!isAddMode && <h1>Edytuj dokument zakupu</h1>}
      <form>
        <label>Wybierz klienta</label>
        <div onClick={findCustomers}>
          <Autocomplete
            id="customer-lookup"
            options={customersList}
            getOptionLabel={(option) => option.label}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Kontrahent"/>}
          />
        </div>
        <label className="main-label">Wybierz transport: </label>
          <div onClick={findTransports}>
            <Autocomplete
              id="transport-lookup"
              options={transportsList}
              getOptionLabel={(option) => option.label}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Transport"/>}
            />
          </div>
        {isAddMode && 
        <>
          <label className="main-label">Dodaj towary:</label>
          {productList.map((item) => {
            let inputPriceId = 'priceOf' + item.type_id;
            let inputWeightId = 'weightOf' + item.type_id;
            return (
              <div className='formProducts' key={item.type_id}>
                <div>{item.type_name}</div>
                <div>Masa:</div>
                <input id={inputWeightId}></input>
                <div>Cena:</div>
                <input id={inputPriceId}></input>
              </div>
            );
          })}
        </>
        }
      
        <div className='btn-panel' style={{transform: 'scale(4.0)'}}>
            {isAddMode && <FaCheckCircle style={{color: 'green', cursor: 'pointer'}}/>}
            {!isAddMode && <FaCheckCircle  style={{color: 'green', cursor: 'pointer'}}/>}
        </div>
        </form>
    </div>
  )
}

export default PurchaseAdd