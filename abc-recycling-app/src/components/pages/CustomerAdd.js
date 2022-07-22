import { useState, useEffect} from "react";
import Axios from "../../request";
import { FaCheckCircle, FaBuilding, FaUserAlt } from 'react-icons/fa'
import { ImCancelCircle} from 'react-icons/im'
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

//Walidacja
const schema = yup.object().shape({
  name: yup.string().required("To pole jest obowiążkowe"),
  nip: yup.number().min(10).max(10).required("Numer NIP jest obowiążkowy"),
  account_number:  yup.number().min(4).max(15).required("Numer konta jest obowiążkowy"),
  email: yup.string().email().required("Email jest obowiążkowy"),
  surname: yup.number().positive().integer(),
  id_number: yup.string().min(4).max(15).required("Numer dowodu jest obowiążkowy"),
});



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
  }, []);
  
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
    event.preventDefault();
    Axios.post('/companyCreate', {
      name: name,
      nip: nip, 
      account_number: account_number, 
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
    e.preventDefault();
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

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const submitForm = (data) => {
    console.log(data);
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
          <form className='simpleForm' onSubmit={handleSubmit(submitForm)}>
            <label>Wpisz nazwę<span class="required">*</span></label>
            
            <input type="text" id="name" name="name" placeholder="Nazwa.." defaultValue={customer?.name}
              onChange={e => setName(e.target.value)}
              >
            </input>
            <p class="required"> {errors.name?.message} </p>
            <label>Wpisz numer NIP<span class="required">*</span></label>
            <input type="text" id="nip" name="nip" placeholder="NIP [10 cyfr]" defaultValue={customer?.nip}
              onChange={e => setNip(e.target.value)}
              >
            </input>
            <p class="required"> {errors.nip?.message} </p>
            <label>Wpisz numer konta<span class="required">*</span></label>
            <input type="text" id="account_number" name="account_number" placeholder="Nr konta.." defaultValue={customer?.account_number} onChange={(event) => {
                setAccountNumber(event.target.value);
              }}>
            </input>
            <p class="required"> {errors.account_number?.message} </p>
            <label>Wpisz adres e-mail<span class="required">*</span></label>
            <input type="text" id="email" name="email" placeholder="E-mail.." defaultValue={customer?.email} onChange={(event) => {
                setEmail(event.target.value);
              }}>
            </input>
            <p class="required"> {errors.email?.message} </p>
            <div className='btn-panel' style={{transform: 'scale(4.0)'}}>
              <ImCancelCircle style={{color: 'grey', cursor: 'pointer', padding: '0 15px'}} onClick={() => {navigate("/customers")}}/>
              {isAddMode && <FaCheckCircle onClick={addCompany} style={{color: 'green', cursor: 'pointer'}}/>}
              {!isAddMode && <FaCheckCircle onClick={updateCompany} style={{color: 'green', cursor: 'pointer'}} />}
              <input type="submit" value="OK" id="submit" className='btn-submit' />
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
              onChange={e => setName(e.target.value)}
              >
            </input>
            <label>Wpisz nazwisko</label>
            <input type="text" id="surname" name="surname" placeholder="Nazwisko.." defaultValue={customer?.surname} onChange={(event) => {
                setSurname(event.target.value);
              }}>
            </input>
            <label>Wpisz numer dowodu</label>
            <input type="text" id="id_number" name="id_number" placeholder="Numer dowodu..[9 znaków]" defaultValue={customer?.id_number} onChange={(event) => {
                setIdNumber(event.target.value);
              }}>
            </input>
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