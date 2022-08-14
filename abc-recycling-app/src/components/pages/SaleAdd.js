import { useState, useEffect} from "react";
import Axios from "../../request";
import { FaCheckCircle} from 'react-icons/fa'
import { useParams, useNavigate  } from "react-router-dom";
import TransportModal from "./TransportModal"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ImCancelCircle} from 'react-icons/im'
import StockInfo from "./StockInfo";

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
  const [transportLabel, setTransportLabel] = useState({id: 0, label: 'Transport'});
  const [customerLabel, setCustomerLabel] = useState({id: 0, label: 'Klient'});
  Axios.defaults.withCredentials = true;
  
  //Walidacja
  const [formValues, setFormValues] = useState({ contractorId: "", Weight: "", price: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const submit = () => {
    updateDocument();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmitting(true);
  };

  const validate = (values) => {
    let errors = {};
    const numericRegex = /\d+[\.]\d+/;
    const numberRegex = /^-?\d+$/;

    if (contractorId === 0) {
      errors.contractorId = "To pole nie może być puste";
    } 

    if(isAddMode){
      productList.forEach(prod => {
        const inputPriceId = 'priceOf' + prod.type_id;
        const inputWeightId = 'weightOf' + prod.type_id;
        let weight = document.getElementById(inputWeightId).value;
        let price = document.getElementById(inputPriceId).value;

        if (weight === '' || weight === null) weight = 0;
        if (price === '' || price === null) price = 0;

        //Walidacja
        if(!numberRegex.test(price) && !numericRegex.test(price)) {
          errors.price = "W pole ceny została wprowadzona wartość, która nie jest liczbą. Dozwolony format: 0 oraz 0.0";
        }

        if(!numberRegex.test(weight) && !numericRegex.test(weight)) {
          errors.weight = "W pole wagi została wprowadzona wartość, która nie jest liczbą. Dozwolony format: 0 oraz 0.0";
        }
      });
    }
    
    return errors;
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      console.log(response.data.loggedIn)
      if (response.data.loggedIn !== true) {
        navigate("/login");
      }
    });

    if(isAddMode && docId === undefined) {
      addDocument();
    }
    else getDocument({id}.id);

    findCompanies();

    if(isAddMode) {
      Axios.get('/productTypes').then(
        response => {
          setProductList(
            JSON.parse(JSON.stringify(response.data))
          );
        }
      )
    }

    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submit();
    }
  }, [formErrors]);

  const addDocument = () => {
    Axios.get('/saleInit').then((response) => {
      setDocId(response.data[0].init_sale);
    })
  };

  const getDocument = (id) => {
    if(!isAddMode) {
      Axios.get(`/sale/${id}`).then((response) => {
        const data = response.data;
        setDocId(id)
        setContractorId(response.data?.contractor_id);
        setTransportId(response.data?.transport_id);

        if(response.data?.transport_id !== null){
          Axios.get(`/getTransportVal/${response.data?.transport_id}`).then((response) => {
            handleTransportAdd(response.data);
          });
        }

        Axios.get(`/CompaniesLookup`).then((response) => {
          const company = response.data.filter(e => e.id === data?.contractor_id);
          setContractorId(company[0].id);
          setCustomerLabel(company[0]);
        });
      });
    }
  };

  const updateDocument = (e) => {
    if(isAddMode) updateProducts();
    Axios.put('/saleDocumentUpdate', {
      document_id: docId,
      contractor_Id: contractorId,
      transport_Id: transportId === 0 ? null : transportId,
    }).then((response) => {
      navigate("/sales");
    });
  };

  const findCompanies = () => {
    Axios('/CompaniesLookup').then(
      response => {
        setCustomersList(response.data.filter(e => e.label !== 'ROBOCZY'));
      }
    )
  };

  const findTransports = () => {
    Axios('/TransportsLookup').then(
      response => {
        setTransportsList(response.data);
      }
    )
  };

  async function handleTransportAdd(val) {
    findTransports();
    setTransportId(val?.id);
    setTransportLabel(val);
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
        <label>Wybierz klienta<span className="required">*</span></label>
        <p className="required"> {formErrors.contractorId} </p>
        <div onClick={findCompanies}>
          <Autocomplete
            id="customer-lookup"
            options={customersList}
            onChange={(event, value) => {
              setContractorId(value.id); 
              handleChange(event);
              setCustomerLabel(value);
            }}
            value={customerLabel}
            getOptionLabel={(option) => option.label || ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Wybierz firmę..." onChange={(e) => setContractorId(e.target.value.id)}/>}
          />
        </div>
        <label className="main-label">Wybierz transport: </label>
        <div onClick={findTransports}>
          <Autocomplete
            id="transport-lookup"
            disablePortal
            options={transportsList}
            onChange={(event, value) => {
              setTransportId(value.id)
              handleChange(event);
              setTransportLabel(value);
            }}
            value={transportLabel}
            getOptionLabel={(option) => option.label || ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Transport" onChange={(e) => setTransportId(e.target.value.id)}/>}
          />
        </div>
        <TransportModal handleTransportAdd={handleTransportAdd} />
        {isAddMode && 
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{margin: '25px 30px 0 0 '}}>
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
            </div>
            <StockInfo/>
          </div>
        }
        <div className='btn-panel' style={{transform: 'scale(4.0)'}}>
          <ImCancelCircle style={{color: 'grey', cursor: 'pointer', padding: '0 15px'}} onClick={() => {navigate("/sales")}}/>
          <FaCheckCircle onClick={handleSubmit} style={{color: 'green', cursor: 'pointer'}}/>
        </div>
      </form>
    </div>
  )
}

export default SaleAdd