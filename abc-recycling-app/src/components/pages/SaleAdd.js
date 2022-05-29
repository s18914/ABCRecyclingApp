import { useState, useEffect} from "react";
import Axios from "../../request";
import {Link} from 'react-router-dom';
import { FaCheckCircle} from 'react-icons/fa'
import { useParams, useNavigate  } from "react-router-dom";

function SaleAdd() {
  
  let { id } = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);
  const navigate = useNavigate();
  const [docId, setDocId] = useState();
  const [customersList, setCustomersList] = useState([]);
  const [contractorId, setContractorId] = useState(0);
  const [transportId, setTransportId] = useState(0);

  useEffect(() => {
    if(isAddMode && docId === undefined) {
      addSale();
    }
    else getSale({id}.id);
  }, [isAddMode]);

  const addSale = () => {
    Axios.get('/saleInit').then((response) => {
      setDocId(response.data[0].init_document);
    })
  };

  const getSale = (id) => {
    if(!isAddMode) {
      Axios.get(`/sale/${id}`).then((response) => {
        setDocId(response.data?.sale_id)
        setContractorId(response.data?.contractor_id);
        setTransportId(response.data?.transport_id);
      });
    }
  };

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