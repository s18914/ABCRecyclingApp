import { useState, useEffect} from "react";
import Axios from "../../request";
import { FaCheckCircle} from 'react-icons/fa'
import { useParams, useNavigate  } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ImCancelCircle} from 'react-icons/im'

function SaleAdd() {
  
  let { id } = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);
  const navigate = useNavigate();
  const [docId, setDocId] = useState();
  const [customersList, setCustomersList] = useState([]);
  const [transportsList, setTransportsList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [contractorId, setContractorId] = useState(0);
  const [transportId, setTransportId] = useState(0);

  useEffect(() => {
    if(isAddMode && docId === undefined) {
      addDocument();
    }
    else getDocument({id}.id);

    if(isAddMode) {
      Axios.get('/productTypes').then(
        response => {
          setProductList(
            JSON.parse(JSON.stringify(response.data))
          );
        }
      )
    }
  }, [isAddMode]);

  const addDocument = () => {
    Axios.get('/saleInit').then((response) => {
      setDocId(response.data[0].init_sale);
    })
  };

  const getDocument = (id) => {
    if(!isAddMode) {
      Axios.get(`/document/${id}`).then((response) => {
        setDocId(response.data?.sale_id)
        setContractorId(response.data?.contractor_id);
        setTransportId(response.data?.transport_id);
      });
    }
  };

  const updateDocument = (e) => {
    e.preventDefault();
    if(isAddMode) updateProducts();
     console.log(contractorId)
    Axios.put('/saleDocumentUpdate', {
      document_id: docId,
      contractor_Id: contractorId,
      transport_Id: transportId,
    }).then((response) => {
      console.log("success", response.data);
      navigate("/sales");
    });
  };

  const findCompanies = () => {
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

  function updateProducts() {
    try {
      productList.forEach(prod => {
        const id = docId;
        const inputPriceId = 'priceOf' + prod.type_id;
        const inputWeightId = 'weightOf' + prod.type_id;
        let weight = document.getElementById(inputWeightId).value;
        let price = document.getElementById(inputPriceId).value;
        if (weight === '' || weight === null) weight = 0;
        if (price === '' || price === null) price = 0;

        Axios.put('/productUpdate', {
          document_id: id,
          type_id: prod.type_id,
          price: price,
          weight: weight
        }).then((response) => {
          console.log("success", response.data);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='main'>
      {isAddMode &&<h1>Dodaj nowy dokument sprzedaży</h1>}
      {!isAddMode && <h1>Edytuj dokument sprzedaży</h1>}
      <form>
        <label>Wybierz klienta</label>
        <div onClick={findCompanies}>
          <Autocomplete
            id="customer-lookup"
            options={customersList}
            onChange={(event, value) => setContractorId(value.id)}
            getOptionLabel={(option) => option.label}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Wybierz firmę"/>}
          />
        </div>
        <label className="main-label">Wybierz transport: </label>
        <div onClick={findTransports}>
          <Autocomplete
            id="transport-lookup"
            options={transportsList}
            onChange={(event, value) => setTransportId(value.id)}
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
                <div className='formProducts simpleForm' key={item.type_id}>
                  <div>{item.name}</div>
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
          <ImCancelCircle style={{color: 'grey', cursor: 'pointer', padding: '0 15px'}} onClick={() => {navigate("/sales")}}/>
          <FaCheckCircle onClick={updateDocument} style={{color: 'green', cursor: 'pointer'}}/>
        </div>
      </form>
    </div>
  )
}

export default SaleAdd