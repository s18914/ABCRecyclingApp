import { useState, useEffect} from "react";
import Axios from "axios";
import { FaCheckCircle, FaBuilding, FaUserAlt } from 'react-icons/fa'
import { useParams } from "react-router-dom";

function CustomerAdd() {
  
  let { id } = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);


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
      Axios.get(`http://localhost:3001/customer/${id}`).then((response) => {
        setCustomer(response.data);
      });
    }
  };

  useEffect(() => {
    getCustomer({id}.id);
  }, []);
  
  const addCustomer = (event) => {
    event.preventDefault();
    Axios.post('http://localhost:3001/customerCreate', {
      name: name, 
      surname: surname, 
      id_number: id_number
    }).then((data) => {
      console.log("success", data.data);
    })
  };

  const addCompany = (event) => {
    event.preventDefault();
    Axios.post('http://localhost:3001/companyCreate', {
      nip: nip, 
      account_number: account_number, 
      email: email
    }).then((data) => {
      console.log("success", data.data);
    })
  };

  const updateCustomer = (e) => {
    e.preventDefault();
    Axios.put('http://localhost:3001/customerUpdate', {
      name: name, 
      surname: surname,
      id_number: id_number,
      id: {id}.id
    }).then((response) => {
      alert("update");
    });
  };

  const deleteCustomer =  (id) => {
    Axios.delete(`http://localhost:3001/customerDelete/${id}`);
  }

  return (
    <div className='main'>
      {isAddMode && 
        <div className='btn-panel'>
          <div onClick={() => {setMode(true)}}>
            <FaBuilding style={{color: 'grey', cursor: 'pointer', transform: 'scale(2.2)', margin: '0 60px'}} />
          </div>
          <div onClick={() => {setMode(false)}}>
            <FaUserAlt style={{color: 'grey', cursor: 'pointer', transform: 'scale(2.2)', margin: '0 60px'}} />
          </div>
        </div>
      }
      {isCompany && 
        <>
          {isAddMode &&<h1>Dodaj nową firmę</h1>}
          {!isAddMode && <h1>Edytuj firmę</h1>}
          <form>
            <label>Wpisz numer NIP</label>
            <input type="text" id="nip" name="nip" placeholder="NIP.." defaultValue={customer?.nip}
              onChange={e => setNip(e.target.value)}
              >
            </input>
            <label>Wpisz numer konta</label>
            <input type="text" id="account_number" name="account_number" placeholder="Nr konta.." defaultValue={customer?.accountNumber} onChange={(event) => {
                setAccountNumber(event.target.value);
              }}>
            </input>
            <label>Wpisz adres e-mail</label>
            <input type="text" id="email" name="email" placeholder="E-mail.." defaultValue={customer?.email} onChange={(event) => {
                setEmail(event.target.value);
              }}>
            </input>
            <a className='btn-panel' href="/customers" style={{transform: 'scale(4.0)'}}>
              {isAddMode && <FaCheckCircle onClick={addCompany} style={{color: 'green', cursor: 'pointer'}}/>}
              {!isAddMode && <FaCheckCircle onClick={updateCustomer} style={{color: 'green', cursor: 'pointer'}}/>}
            </a>
          </form>
        </>
      }
      {!isCompany &&
        <>
          {isAddMode &&<h1>Dodaj nowego klienta</h1>}
          {!isAddMode && <h1>Edytuj klienta</h1>}
          <form>
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
            <input type="text" id="id_number" name="id_number" placeholder="Numer dowodu.." defaultValue={customer?.id_number} onChange={(event) => {
                setIdNumber(event.target.value);
              }}>
            </input>
            <a className='btn-panel' href="/customers" style={{transform: 'scale(4.0)'}}>
              {isAddMode && <FaCheckCircle onClick={addCustomer} style={{color: 'green', cursor: 'pointer'}}/>}
              {!isAddMode && <FaCheckCircle onClick={updateCustomer} style={{color: 'green', cursor: 'pointer'}}/>}
            </a>
          </form>
        </>
      }
    </div>
  )
}

export default CustomerAdd