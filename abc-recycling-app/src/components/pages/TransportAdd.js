import React from 'react';
import { useState } from "react";
import Axios from "../../request";
import { useParams, useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FaCheckCircle, FaPlus, FaListUl} from 'react-icons/fa'
import {Link} from 'react-router-dom';

function TransportAdd() {
  const [transport, setTransport] = useState();

  //transport
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");

  //adres
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState(0);
  const [flatNumber, setFlatNumber] = useState(0);
  const [zipCodeId, setZipCodeId] = useState(0);

  //listy samochodu, pracownika, adresu
  const [carsList, setCarList] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [zipCodesList, setZipCodesList] = useState([]);

  //id do lookupa samochodu, pracownika, adresu
  const [carId, setCarId] = useState(0);
  const [workerId, setWorkerId] = useState(0);
  const [addressId, setAddressId] = useState(0);

  const {id} = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);

  const [open, setOpen] = React.useState(false);  

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleOpen = () => {
    setOpen(true);
  }

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

  const findZipCodes = () => {
    Axios('/ZipCodesLookup').then(
      response => {
        setWorkersList(response.data);
        console.log(response.data);
      }
    )
  };

  return (
    <div className='main'>
      {isAddMode &&<h1>Dodaj nowy transport</h1>}
      {!isAddMode && <h1>Edytuj transport</h1>}
      <form>
        <label>Wybierz adres</label>
        <div>
          <div style={{display: 'inline-block', verticalAlign: 'middle', marginTop: '10px'}} onClick={console.log('adresy')}>
            <Autocomplete
              id="addressLookup"
              options={zipCodesList}
              onChange={(newValue) => {
                setAddressId(newValue.id);
              }}
              sx={{ width: 500 }}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => <TextField {...params} label="Adres" />}
            />
          </div>
          <FaPlus title='Dodaj nowy adres' className='icon' onClick={handleOpen}> </FaPlus>
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box className='modal'>
          <form>
          <div>
            <label htmlFor="street">Ulica:</label>
            <input type="text" id="street" name="street" 
            onChange={(event) => {
              setStreet(event.target.value);
            }}>
            </input>
          </div> 
          <div>
            <label htmlFor="houseNumber">Numer Domu:</label>
            <input type="integer" id="houseNumber" name="houseNumber" 
            onChange={(event) => {
              setHouseNumber(event.target.value);
            }}>
            </input>
          </div>
          <div>
            <label htmlFor="flat_number">Numer Lokalu:</label>
            <input type="integer" id="houseNumber" name="houseNumber" 
            onChange={(event) => {
              setFlatNumber(event.target.value);
            }}>
            </input>
          </div>
          <div>
            <label htmlFor="zipCode">Kod pocztowy:</label>
          <div style={{verticalAlign: 'middle', marginTop: '10px'}} onClick={findZipCodes}>
            <Autocomplete
              id="zipCodesLookup"
              options={zipCodesList}
              onChange={(newValue) => {
                setZipCodeId(newValue.id);
              }}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => <TextField {...params} label="Kod pocztowy" />}
            />
            </div>
          </div>
          <button className="form-control btn btn-primary" type="submit">
            Dodaj
          </button>
          </form>
        </Box>
        </Modal>

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
              onChange={(newValue) => {
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
            id="workerLookup"
            options={workersList}
            onChange={(newValue) => {
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
    </div>
  )
}

export default TransportAdd
