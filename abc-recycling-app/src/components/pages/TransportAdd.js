import React from 'react';
import { useState } from "react";
import Axios from "../../request";
import { useParams } from 'react-router';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FaCheckCircle } from 'react-icons/fa'

function TransportAdd() {
  const [transport, setTransport] = useState();
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [overviewDate, setOverviewDate] = useState("");

  const [carsList, setCarList] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [addressList, setAddressList] = useState([]);

  const [carIs, setCarId] = useState(0);
  const [workerId, setWorkerId] = useState(0);
  const [addressId, setAddressId] = useState(0);

  const {id} = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);

  const [open, setOpen] = React.useState(false);  
  const [value, setValue] = React.useState(null);

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleOpen = () => {
    setOpen(true);
  }

  const addTransport = (event) => {
    event.preventDefault();
    Axios.post('/transportCreate', {
      date: date, 
      phone: phone, 
      address: address
    }).then((data) => {
      console.log("success", data.data);
    })
  };

  const addCar = (event) => {
    event.preventDefault();
    Axios.post('/carCreate', {
      registrationNumber: registrationNumber, 
      overviewDate: overviewDate
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

  return (
    <div className='main'>
      {isAddMode &&<h1>Dodaj nowy transport</h1>}
      {!isAddMode && <h1>Edytuj transport</h1>}
      <form>
        <label>Wybierz adres</label>
        <br />
        <div>
          <Autocomplete
            id="addressLookup"
            options={addressList}
            onChange={(newValue) => {
              setAddressId(newValue.id);
            }}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => <TextField {...params} label="Adres" />}
          />
        </div>
        <Button onClick={handleOpen}>Dodaj nowy adres</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box class='modal'>
          <form className='formAddress' onSubmit={console.log('hej')}>
          <div className="form-group">
            <label className="labelAddress" htmlFor="street">Ulica</label>
            <input className="form-control" id="street"/>
          </div> 
          <div className="form-group">
            <label className="labelAddress" htmlFor="house_number">Numer Domu</label>
            <input type="house_number" className="form-control" id="house_number"
            placeholder="np. 1" />
          </div>
          <div className="form-group">
            <label className="labelAddress" htmlFor="flat_number">Numer Lokalu</label>
            <input type="flat_number" className="form-control" id="flat_number"
            placeholder="np. 1" />
          </div>
          <div className="form-group">
            <label className="labelAddress" htmlFor="zip_code">Kod pocztowy</label>
            <input type="zip_code" className="form-control" id="zip_code"
            placeholder="np. 00-000" />
          </div>
          <div className="form-group">
            <label className="labelAddress" htmlFor="city">Miasto</label>
            <input type="city" className="form-control" id="city"
            placeholder="np. Kraków" />
          </div>
          <div className="form-group">
          <button className="form-control btn btn-primary" type="submit">
            Dodaj
          </button>
          </div>
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
        <br />
        <div onClick={findCars}>
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
        <label>Wybierz kierowcę</label>
        <br />
        <div onClick={findDrivers}>
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
