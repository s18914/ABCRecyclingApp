import { useState, useEffect} from "react";
import Axios from "../../request";
import { FaCheckCircle} from 'react-icons/fa'
import { useParams, useNavigate} from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import TransportModal from "./TransportModal";
import { ImCancelCircle} from 'react-icons/im';

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
  const [transportLabel, setTransportLabel] = useState({id: 0, label: 'Transport'});
  const [customerLabel, setCustomerLabel] = useState({id: 0, label: 'Klient'});

  //Walidacja
  const [formValues, setFormValues] = useState({ contractorId: "", id_number: "", weight: "", price: "" });
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
    const idRegex = /([a-z]|[A-Z]){3}[0-9]{6}/;
    const numericRegex = /\d+[\.]\d+/;
    const numberRegex = /^-?\d+$/;

    if (isCompany !== null && contractorId === 0) {
      errors.contractorId = "To pole nie może być puste";
    } else if (isCompany === null && !values.id_number) {
      errors.contractorId = "To pole nie może być puste";
    } else if (isCompany === null && (!idRegex.test(values.id_number) || values.id_number.length !== 9)) {
      errors.contractorId = "Numer dowodu powinien składać się z 3 liter oraz 6 cyfr i mieć format: AAA000000";
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
          errors.price = "W pole CENY została wprowadzona wartość, która nie jest liczbą. Dozwolony format: 0 oraz 0.0";
        }

        if(!numberRegex.test(weight) && !numericRegex.test(weight)) {
          errors.weight = "W pole WAGI została wprowadzona wartość, która nie jest liczbą. Dozwolony format: 0 oraz 0.0";
        }
      });
    }
    
    return errors;
  };

  useEffect(() => {
    findTransports();
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

    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submit();
    }
  }, [formErrors]);

  const addDocument = () => {
    Axios.get('/purchaseInit').then((response) => {
      console.log("moje nowe id: "+ response.data[0].init_purchase)
      setDocId(response.data[0].init_purchase);
    })
  };

  const getDocument = (id) => {
    if(!isAddMode) {
      Axios.get(`/purchase/${id}`).then((response) => {
        const data = response.data;
        setDocId(response.data?.document_id);
        setContractorId(response.data?.contractor_id);
        setTransportId(response.data?.transport_id);
        
        if(response.data?.transport_id !== null){
          Axios.get(`/getTransportVal/${response.data?.transport_id}`).then((response) => {
            handleTransportAdd(response.data);
          });
        }

        Axios.get(`/CompaniesLookup`).then((response) => {
          if(response.data.filter(e => e.id === data?.contractor_id).length !== 0){
            const company = response.data.filter(e => e.id === data?.contractor_id);
            setContractorId(company[0].id);
            setCustomerLabel(company[0]);
          } else {
            setIsCompany(false);
            Axios.get(`/CustomersLookup`).then((response) => {
              const customer = response.data.filter(e => e.id === data?.contractor_id);
              setContractorId(customer[0].id);
              setCustomerLabel(customer[0]);
              document.getElementById("isCustomercheck").checked = true;
            });
          }
        });
      });
    }
  };

  const updateDocument = (e) => {
    if(isCompany === null){
      Axios.put('/purchaseDocumentUpdateAndAddPerson', {
        document_id: docId,
        id_number: id_number,
        transport_Id: transportId,
      }).then((response) => {
        navigate("/purchases");
      });
    } else {
      console.log(docId+ " " +  contractorId + " " +  transportId)
      Axios.put('/purchaseDocumentUpdate', {
        document_id: docId,
        contractor_Id: contractorId,
        transport_Id: transportId,
      }).then((response) => {
        console.log(response)
        navigate("/purchases");
      }); 
    }

    if(isAddMode) updateProducts();
  };

  const findCompanies = () => {
    Axios('/CompaniesLookup').then(
      response => {
        setCustomersList(response.data.filter(e => e.label !== 'ROBOCZY'))
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
      {isAddMode &&<h1>Dodaj nowy dokument zakupu</h1>}
      {!isAddMode && <h1>Edytuj dokument zakupu</h1>}
      <div style={{padding: '20px 0'}}>
        <input type="radio" defaultChecked value="Company" name="contractor" onClick={() => {setIsCompany(true)}}/> Firma
        <input type="radio" id="isCustomercheck" value="Customer" name="contractor"  onClick={() => {setIsCompany(false)}} style={{marginLeft: '20px'}} /> Osoba prywatna
        <input type="radio" value="Company" name="contractor" onClick={() => {setIsCompany(null)}} style={{marginLeft: '20px'}}/> Nowa osoba
      </div>
      <form>
        <label>Wybierz klienta<span className="required">*</span></label>
        <p className="required"> {formErrors.contractorId} </p>
        {isCompany === true && 
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
              checked={isCompany}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Wybierz firmę..." onChange={(e) => setContractorId(e.target.value.id)}/>}
            />
          </div>
        }
        {isCompany === false && 
          <div onClick={findCustomers}>
            <Autocomplete
              id="customer-lookup"
              options={customersList}
              onChange={(event, value) => {
                setContractorId(value.id); 
                handleChange(event);
                setCustomerLabel(value)
              }}
              value={customerLabel}
              getOptionLabel={(option) => option.label || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Wybierz osobę..." onChange={(e) => setContractorId(e.target.value.id)}/>}
            />
          </div>
        }
        {isCompany === null && 
          <div className='simpleForm'>
            <input id="id_number" name='id_number' placeholder="Wprowadź numer dowodu nowego klienta..." style={{width: '40%', height: '56px'}} onChange={(event) => {
                setIdNumber(event.target.value);
                handleChange(event)
              }}></input>
          </div>
        }
        <label className="main-label">Wybierz transport: </label>
          <div onClick={findTransports}>
            <Autocomplete
              id="transport-lookup"
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
        <>
          <label className="main-label">Dodaj towary:</label>
          <p className="required"> {formErrors.weight} </p>
          <p className="required"> {formErrors.price} </p>
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
          <FaCheckCircle onClick={handleSubmit} style={{color: 'green', cursor: 'pointer'}}/>
        </div>
        </form>
    </div>
  )
}

export default PurchaseAdd