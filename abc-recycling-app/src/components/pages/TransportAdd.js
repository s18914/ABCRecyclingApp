import React from 'react';
import { useState } from "react";
import Axios from "../../request";
import { useParams } from 'react-router';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


function TransportAdd() {
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [overviewDate, setOverviewDate] = useState("");
  const [carsList, setCarList] = useState([]);
  const [workersList, setWorkersList] = useState([]);

  const {id} = useParams();

  const [open, setOpen] = React.useState(false);  
  const [value, setValue] = React.useState(null);

  const handleClose = () => {
    setOpen(false);
  };

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

  const handleOpen = () => setOpen(true);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className='main'>
      <h1>Dodaj nowy transport</h1>
      <form>
        <label>Wybierz adres</label>
        <input type="text" id="address" name="address" placeholder="Adres.." onChange={(event) => {
            setAddress(event.target.value);
          }}>
        </input>
        <Button onClick={handleOpen}>Dodaj nowy adres</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
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
          <button className="form-control btn btn-primary" type="cancel">
            Anuluj
          </button>
          </div>
          </form>
        </Box>
        </Modal>
        <label>Wybierz datę</label>
        <input type="date" id="date" name="date" 
        //defaultValue={transport?.date}
        onChange={(event) => {
            setDate(event.target.value);
        }}>
        </input>
        <label>Wpisz telefon odbiorcy</label>
        <input type="text" id="phone" name="phone" onChange={(event) => {
            setPhone(event.target.value);
          }}>
        </input>
        <label>Wybierz ciężarówkę</label>
        <br />
        <div onClick={findCars}>
          <Autocomplete
            id="grouped-demo"
            options={carsList}
            getOptionLabel={(option) => option.label}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Ciężarówka" />}
          />
        </div>
        <label>Wybierz kierowcę</label>
        <br />
        <div onClick={findDrivers}>
          <Autocomplete
            id="grouped-demo"
            options={workersList}
            getOptionLabel={(option) => option.label}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Kierowca" />}
          />
        </div>
      </form>
      <div className='btn-panel'>
        <Link to={'/transports'}>
          <button onClick={addTransport}>
            Zatwierdź
          </button>
        </Link> 
        <Link to={'/transports'}>
          <button>
            Anuluj
          </button>
        </Link>
      </div>
    </div>
  )
}

export default TransportAdd
