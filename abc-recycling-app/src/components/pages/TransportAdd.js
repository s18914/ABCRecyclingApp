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

  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [carsList, setCarList] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [carId, setCarId] = useState(0);
  const [workerId, setWorkerId] = useState(0);
  const [addressId, setAddressId] = useState(0);
  const {id} = useParams();
  const navigate = useNavigate();
  const [transport, setTransport] = useState();
  let isAddMode = ({id}.id === undefined ? true : false);

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
      <form>
      <div className='simpleForm'>
        <label>Wybierz datę</label>
        <div style={{ width: '300px'}}>
        <input type="date" id="date" name="date" defaultValue={transport?.date}
        onChange={(event) => {
          setDate(event.target.value);
        }}>
        </input>
        </div>

        <label>Wpisz telefon odbiorcy</label>
        <div style={{ width: '300px'}}>
        <input type="text" id="phone" name="phone" defaultValue={transport?.phone}
        onChange={(event) => {
          setPhone(event.target.value);
        }}>
        </input>
        </div>
        </div>
        
        <div>
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
        </div>

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
        </div>

        <label>Wybierz kierowcę</label>
        <br></br>
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
        
        </div>

        <div className='btn-panel' style={{transform: 'scale(4.0)'}}>
          <ImCancelCircle style={{color: 'grey', cursor: 'pointer', padding: '0 15px'}} onClick={() => {navigate("/transports")}}/>
          {isAddMode && <FaCheckCircle onClick={addTransport} style={{color: 'green', cursor: 'pointer'}}/>}
          {!isAddMode && <FaCheckCircle style={{color: 'green', cursor: 'pointer'}} />}
        </div>
      </form>
    </div>
  )
}

export default TransportAdd
