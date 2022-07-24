import { useState, useEffect} from "react";
import Axios from "../../request";
import { FaCheckCircle, FaBuilding, FaUserAlt } from 'react-icons/fa'
import { ImCancelCircle} from 'react-icons/im'
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";


function CustomerAdd() {
  
  let { id } = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);
  const navigate = useNavigate();

  const [customer, setCustomer] = useState();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [id_number, setIdNumber] = useState("");
  const [nip, setNip] = useState("");
  const [account_number, setAccountNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isCompany, setMode] = useState(true);

  //walidacja
  const [formValues, setFormValues] = useState({ name: "", surname: "", id_number: "", nip: "", account_number: "", email: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {
    console.log(formValues);
    if(isCompany){
      if(isAddMode) addCompany();
      updateCompany();
    } else {
      if(isAddMode) addCustomer();
      updateCustomer();
    }
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const numberRegex = /[0-9]*/;
    const nipRegex = /[0-9]{4}-[0-9]{3}-[0-9]{3}/;
    const idRegex = /([a-z]|[A-Z]){4}[0-9]{6}/;
    const accountRegex = /[0-9]{2}-[0-9]{8}-[0-9]{19}/;

    if(isCompany){

      if (!values.name) {
        errors.name = "To pole nie może być puste";
      } 

      if (!values.nip) {
        errors.nip = "To pole nie może być puste";
      } else if ((!numberRegex.test(values.nip) && values.nip.length !== 10) || !nipRegex.test(values.nip)) {
        errors.nip = "nip powinien składać się z 10 cyfr i mieć format: 0000-000-000 lub być pisany ciągiem";
      }

      if (!values.account_number) {
        errors.account_number = "To pole nie może być puste";
      } else if ((!numberRegex.test(values.account_number) && values.account_number.length !== 26) || !accountRegex.test(values.account_number)) {
        errors.account_number = "Numer konta powinien składać się z 26 cyfr i mieć format: 00-00000000-0000000000000000 lub być pisany ciągiem";
      }

      if (!values.email) {
        errors.email = "To pole nie może być puste";
      } else if (!emailRegex.test(values.email)) {
        errors.email = "Adres email nie jest poprawny";
      }
    } else {
      if (!values.surname) {
        errors.surname = "To pole nie może być puste";
      } 
      if (!values.id_number) {
        errors.id_number = "To pole nie może być puste";
      }else if ((!numberRegex.test(values.id_number) && values.id_number.length !== 10) || !idRegex.test(values.id_number)) {
        errors.id_number = "Numer dowodu powinien składać się z 4 liter oraz 6 cyfr i mieć format: AAAA000000";
      }
    }

    return errors;
  };


  const getCustomer = (id) => {
    if(!isAddMode) {
      Axios.get(`/customer/${id}`).then((response) => {
        setCustomer(response.data);
        setName(response.data?.name);
        setSurname(response.data?.surname);
        setIdNumber(response.data?.id_number);
        setNip(response.data?.nip);
        setAccountNumber(response.data?.account_number);
        setEmail(response.data?.email);
        if(response.data?.nip === null) {setMode(false)}
      });
    }
  };

  useEffect(() => {
    getCustomer({id}.id);
    console.log(formErrors);
    console.log( Object.keys(formErrors).length + "  ii")
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submit();
    }
  }, [formErrors]);
  
  const addCustomer = (event) => {
    event.preventDefault();
    Axios.post('/customerCreate', {
      name: name, 
      surname: surname, 
      id_number: id_number
    }).then((response) => {
      console.log("success", response.data);
      navigate("/customers");
    })
  };

  const addCompany = (event) => {

      Axios.post('/companyCreate', {
        name: name,
        nip: nip.replace('-', ''), 
        account_number: account_number.replace('-', ''),
        email: email
      }).then((response) => {
        console.log("success", response.data);
        navigate("/customers");
      })
    
  };

  const updateCustomer = (e) => {
    e.preventDefault();
    Axios.put('/customerUpdate', {
      name: name, 
      surname: surname,
      id_number: id_number,
      id: {id}.id
    }).then((response) => {
      console.log("success", response.data);
      navigate("/customers");
    });
  };

  const updateCompany = (e) => {
    Axios.put('/companyUpdate', {
      name: name, 
      nip: nip, 
      account_number: account_number, 
      email: email,
      id: {id}.id
    }).then((response) => {
      console.log("success", response.data);
      navigate("/customers");
    });
  };

  
  return (
    <div className='main'>
      {isAddMode && 
      <>
        {isCompany && 
          <>
            <div className='btn-panel'>
              <div onClick={() => {setMode(true)}}>
                <FaBuilding style={{color: 'green', cursor: 'pointer', transform: 'scale(2.2)', margin: '0 60px'}} />
              </div>
              <div onClick={() => {setMode(false)}}>
                <FaUserAlt style={{color: 'grey', cursor: 'pointer', transform: 'scale(2.2)', margin: '0 60px'}} />
              </div>
            </div>
          </>
        }
        {!isCompany && 
          <>
            <div className='btn-panel'>
              <div onClick={() => {setMode(true)}}>
                <FaBuilding style={{color: 'grey', cursor: 'pointer', transform: 'scale(2.2)', margin: '0 60px'}} />
              </div>
              <div onClick={() => {setMode(false)}}>
                <FaUserAlt style={{color: 'green', cursor: 'pointer', transform: 'scale(2.2)', margin: '0 60px'}} />
              </div>
            </div>
          </>
        }
      </>
        
      }
      {isCompany && 
        <>
          {isAddMode &&<h1>Dodaj nową firmę</h1>}
          {!isAddMode && <h1>Edytuj firmę</h1>}
          <form className='simpleForm' onSubmit={handleSubmit} noValidate>
            <label>Wpisz nazwę<span className="required">*</span></label>
            <input type="text" id="name" name="name" placeholder="Nazwa.." defaultValue={customer?.name}
              onChange={(e) => {setName(e.target.value); handleChange(e);}}
              >
            </input>
            <p className="required"> {formErrors.name} </p>
            <label>Wpisz numer NIP<span className="required">*</span></label>
            <input type="text" id="nip" name="nip" placeholder="NIP [10 cyfr]" defaultValue={customer?.nip}
              onChange={(e) => {setNip(e.target.value); handleChange(e);}}
              >
            </input>
            <p className="required"> {formErrors.nip} </p>
            <label>Wpisz numer konta<span className="required">*</span></label>
            <input type="text" id="account_number" name="account_number" placeholder="Nr konta.." defaultValue={customer?.account_number} onChange={(e) => {
                setAccountNumber(e.target.value);
                handleChange(e);
              }}>
            </input>
            <p className="required"> {formErrors.account_number} </p>
            <label>Wpisz adres e-mail<span className="required">*</span></label>
            <input type="text" id="email" name="email" placeholder="E-mail.." defaultValue={customer?.email} onChange={(e) => {
                setEmail(e.target.value);
                handleChange(e);
              }}>
            </input>
            <p className="required"> {formErrors.email} </p>
            <div className='btn-panel' style={{transform: 'scale(4.0)'}}>
              <ImCancelCircle style={{color: 'grey', cursor: 'pointer', padding: '0 15px'}} onClick={() => {navigate("/customers")}}/>
              <FaCheckCircle onClick={handleSubmit} style={{color: 'green', cursor: 'pointer'}}/>
              
            </div>
          </form>
        </>
      }
      {!isCompany &&
        <>
          {isAddMode &&<h1>Dodaj nowego klienta</h1>}
          {!isAddMode && <h1>Edytuj klienta</h1>}
          <form className='simpleForm'>
            <label>Wpisz imię</label>
            <input type="text" id="name" name="name" placeholder="Imię.." defaultValue={customer?.name}
              onChange={(e) => {setName(e.target.value); handleChange(e);}}
              >
            </input>
            <label>Wpisz nazwisko</label>
            <input type="text" id="surname" name="surname" placeholder="Nazwisko.." defaultValue={customer?.surname} onChange={(e) => {
                setSurname(e.target.value);
                handleChange(e);
              }}>
            </input>
            <label>Wpisz numer dowodu<span className="required">*</span></label>
            <input type="text" id="id_number" name="id_number" placeholder="Numer dowodu..[9 znaków]" defaultValue={customer?.id_number} onChange={(e) => {
                setIdNumber(e.target.value);
                handleChange(e);
              }}>
            </input>
            <p className="required"> {formErrors.id_number} </p>
            <div className='btn-panel' style={{transform: 'scale(4.0)'}}>
              <ImCancelCircle style={{color: 'grey', cursor: 'pointer', padding: '0 15px'}} onClick={() => {navigate("/customers")}}/>
              {isAddMode && <FaCheckCircle onClick={addCustomer} style={{color: 'green', cursor: 'pointer'}}/>}
              {!isAddMode && <FaCheckCircle onClick={updateCustomer} style={{color: 'green', cursor: 'pointer'}}/>}
            </div>
          </form>
        </>
      }
    </div>
  )
}

export default CustomerAdd