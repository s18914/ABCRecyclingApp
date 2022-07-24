import React from 'react';
import { useState } from "react";
import Axios from "../../request";
import { useParams, useNavigate } from "react-router-dom";
import { ImCancelCircle} from 'react-icons/im'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import { FaCheckCircle, FaPlus, FaListUl} from 'react-icons/fa'
import {Link} from 'react-router-dom';

function TransportAdd() {
  //transport
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");

  //listy samochodu, pracownika, adresu
  const [carsList, setCarList] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [addressList, setAddressList] = useState([]);

  //id do lookupa samochodu, pracownika, adresu
  const [carId, setCarId] = useState(0);
  const [workerId, setWorkerId] = useState(0);
  const [addressId, setAddressId] = useState(0);
  const {id} = useParams();
  const navigate = useNavigate();
  const [transport, setTransport] = useState();
  let isAddMode = ({id}.id === undefined ? true : false);
  const [open, setOpen] = React.useState(false);  

  const addTransport = (event) => {
    event.preventDefault();
    Axios.post('/transportCreate', {
      addressId: addressId,
      date: date, 
      phone: phone, 
      carId: carId,
      workerId: workerId
    }).then((data) => {
      console.log("success", data.data);
    })
  };

  const findCars = () => {
    Axios('/CarsLookup').then(
      response => {
        setCarList(response.data);
        console.log(response.data);
      }
    )
  };

  const findDrivers = () => {
    Axios('/WorkersLookup').then(
      response => {
        setWorkersList(response.data);
        console.log(response.data);
      }
    )
  };

  const findAddresses = () => {
    Axios('/addressLookup').then(
      response => {
        setAddressList(response.data);
        console.log(response.data);
      }
    )
  };

  return (
    <div className='main'>
      {isAddMode &&<h1>Dodaj nowy transport</h1>}
      {!isAddMode && <h1>Edytuj transport</h1>}
      <form className='simpleForm'>

        <label>Wybierz adres</label>
        <div>
          <div style={{display: 'inline-block', verticalAlign: 'middle', marginTop: '10px'}} onClick={findAddresses}>
            <Autocomplete
              id="addressLookup"
              options={addressList}
              onChange={(event, newValue) => {
                setAddressId(newValue.id);
              }}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Adres" />}
            />
          </div>
          <Link to='/address/add'>
          <FaPlus title='Dodaj nowy adres' className='icon'> </FaPlus>
          </Link>
          <Link to='/addresses'>
          <FaListUl title='Zobacz listę adresów' className='icon'> </FaListUl>
          </Link>
        </div>

        <label>Wybierz datę</label>
        <input type="date" id="date" name="date" defaultValue={transport?.date}
        onChange={(event) => {
          setDate(event.target.value);
        }}>
        </input>

        <label>Wpisz telefon odbiorcy</label>
        <input type="text" id="phone" name="phone" defaultValue={transport?.phone}
        onChange={(event) => {
          setPhone(event.target.value);
        }}>
        </input>

        <label>Wybierz ciężarówkę</label>
        <div>
          <div style={{display: 'inline-block', verticalAlign: 'middle', marginTop: '10px'}} onClick={findCars}>
            <Autocomplete
              id="carsLookup"
              options={carsList}
              onChange={(event, newValue) => {
                setCarId(newValue.id);
              }}
              getOptionLabel={(option) => option.label}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Ciężarówka" />}
            />
          </div>
          <Link to='/cars/add'>
          <FaPlus title='Dodaj nową ciężarówkę' className='icon'> </FaPlus>
          </Link>
          <Link to='/cars'>
          <FaListUl title='Zobacz listę ciężarówek' className='icon'> </FaListUl>
          </Link>
        </div>

        <label>Wybierz kierowcę</label>
        <div style={{display: 'inline-block', verticalAlign: 'middle', marginTop: '10px'}} onClick={findDrivers}>
          <Autocomplete
            id="WorkersLookup"
            options={workersList}
            onChange={(event, newValue) => {
              setWorkerId(newValue.id);
            }}
            getOptionLabel={(option) => option.label}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Kierowca" />}
          />
        </div>

        <div className='btn-panel' style={{transform: 'scale(4.0)'}}>
          {isAddMode && <FaCheckCircle onClick={addTransport} style={{color: 'green', cursor: 'pointer'}}/>}
          {!isAddMode && <FaCheckCircle style={{color: 'green', cursor: 'pointer'}} />}
        </div>
      </form>
      <div className='btn-panel'>
        <a href={'/transports'}>
          <ImCancelCircle style={{color: 'grey', cursor: 'pointer', padding: '0 15px'}} onClick={() => {navigate("/transports")}}/>
          <button onClick={addTransport}>
            Zatwierdź
          </button>
        </a> 
        <a href={'/transports'}>
          <button>
            Anuluj
          </button>
        </a> 
      </div>
    </div>
  )
}

export default TransportAdd
