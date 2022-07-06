import { useState, useEffect} from "react";
import Axios from "../../request";
import { FaCheckCircle} from 'react-icons/fa'
import { useParams, useNavigate} from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ImCancelCircle} from 'react-icons/im'

function PurchaseAdd() {
  
  let { id } = useParams();
  const navigate = useNavigate();
  let isAddMode = ({id}.id === undefined ? true : false);
  const [docId, setDocId] = useState();
  const [customersList, setCustomersList] = useState([]);
  const [transportsList, setTransportsList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [contractorId, setContractorId] = useState(0);
  const [id_number, setIdNumber] = useState("");
  const [transportId, setTransportId] = useState(null);
  const [isCompany, setIsCompany] = useState(true);

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
  }, [docId]);

  const addDocument = () => {
    Axios.get('/purchaseInit').then((response) => {
      setDocId(response.data[0].init_purchase);
    })
  };

  const getDocument = (id) => {
    if(!isAddMode) {
      Axios.get(`/document/${id}`).then((response) => {
        setDocId(response.data?.document_id);
        setContractorId(response.data?.contractor_id);
        setTransportId(response.data?.transport_id);
      });
    }
  };

  const updateDocument = (e) => {
    e.preventDefault();

    if(isCompany === null){
      Axios.put('/purchaseDocumentUpdateAndAddPerson', {
        document_id: docId,
        id_number: id_number,
        transport_Id: transportId,
      }).then((response) => {
        console.log("success", response.data);
        navigate("/purchases");
      });
    } else {
      Axios.put('/purchaseDocumentUpdate', {
        document_id: docId,
        contractor_Id: contractorId,
        transport_Id: transportId,
      }).then((response) => {
        console.log("success", response.data);
        navigate("/purchases");
      }); 
    }

    if(isAddMode) updateProducts();
  };

  const findCompanies = () => {
    Axios('/CompaniesLookup').then(
      response => {
        setCustomersList(response.data);
      }
    )
  };

  const findCustomers = () => {
    Axios('/CustomersLookup').then(
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
      {isAddMode &&<h1>Dodaj nowy dokument zakupu</h1>}
      {!isAddMode && <h1>Edytuj dokument zakupu</h1>}
      <div style={{padding: '20px 0'}}>
        <input type="radio" defaultChecked value="Company" name="contractor" onClick={() => {setIsCompany(true)}}/> Firma
        <input type="radio" value="Customer" name="contractor"  onClick={() => {setIsCompany(false)}} style={{marginLeft: '20px'}} /> Osoba prywatna
        <input type="radio" value="Company" name="contractor" onClick={() => {setIsCompany(null)}} style={{marginLeft: '20px'}}/> Nowa osoba
      </div>
      <form>
        <label>Wybierz klienta</label>
        {isCompany === true && 
          <div onClick={findCompanies}>
            <Autocomplete
              id="customer-lookup"
              options={customersList}
              onChange={(event, value) => setContractorId(value.id)}
              getOptionLabel={(option) => option.label}
              checked={isCompany}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Wybierz firmę"/>}
            />
          </div>
        }
        {isCompany === false && 
          <div onClick={findCustomers}>
            <Autocomplete
              id="customer-lookup"
              options={customersList}
              onChange={(event, value) => setContractorId(value.id)}
              getOptionLabel={(option) => option.label}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Wybierz osobę"/>}
            />
          </div>
        }
        {isCompany === null && 
          <div className='simpleForm'>
            <input id="id_number" placeholder="Wprowadź numer dowodu nowego klienta" style={{width: '40%'}} onChange={(event) => {
                setIdNumber(event.target.value);
              }}></input>
          </div>
        }
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
          <ImCancelCircle style={{color: 'grey', cursor: 'pointer', padding: '0 15px'}} onClick={() => {navigate("/purchases")}}/>
          <FaCheckCircle onClick={updateDocument} style={{color: 'green', cursor: 'pointer'}}/>
        </div>
        </form>
    </div>
  )
}

export default PurchaseAdd