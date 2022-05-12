import React from 'react';
import { useState } from "react";
import Axios from "axios";
import { useParams } from 'react-router';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';


function TransportAdd() {
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [overviewDate, setOverviewDate] = useState("");
  const [carList, setCarList] = useState([]);

  const {id} = useParams();

  const [open, setOpen] = React.useState(false);

  
  const [value, setValue] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const addTransport = (event) => {
    event.preventDefault();
    Axios.post('http://localhost:3001/transportCreate', {
      date: date, 
      phone: phone, 
      address: address
    }).then((data) => {
      console.log("success", data.data);
    })
  };

  const addCar = (event) => {
    event.preventDefault();
    Axios.post('http://localhost:3001/carCreate', {
      registrationNumber: registrationNumber, 
      overviewDate: overviewDate
    }).then((data) => {
      console.log("success", data.data);
    })
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
        {/* <input type="text" id="date" name="date" placeholder="Data.."
          onChange={(event) => {
            setDate(event.target.value);
          }}>
        </input> */}
        <div className='dataPicker'>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker 
          label="Data transportu"
          inputFormat="MM/dd/yyyy"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
        </LocalizationProvider>
        </div>
        <label>Wpisz telefon odbiorcy</label>
        <input type="text" id="phone" name="phone" placeholder="Telefon.." onChange={(event) => {
            setPhone(event.target.value);
          }}>
        </input>
        <label>Wybierz ciężarówkę</label>
        <select>
          <option value="Ford 1">ford XYUD825</option>
          <option value="Ford 2">ford XZUD825</option>
        </select>
        <div>
        {/* <Button onClick={handleOpen}>Dodaj nowy adres</Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
          <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
          </Box>
          </Modal> */}
    </div>
      </form>
      <div className='btn-panel'>
        <a href={'/transports'}>
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
