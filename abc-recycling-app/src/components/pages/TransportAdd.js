import React from 'react';
import { useState } from "react";
import Axios from "axios";
import { useParams } from 'react-router';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DatePicker from "@material-ui/lab/DatePicker";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DateFNSUtils from "@material-ui/lab/AdapterDateFns";


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

  return (
    <div className='main'>
      <h1>Dodaj nowy transport</h1>
      <form>
        <label>Wpisz adres</label>
        <input type="text" id="address" name="address" placeholder="Adres.." onChange={(event) => {
            setAddress(event.target.value);
          }}>
        </input>
        <label>Wybierz datę</label>
        <input type="text" id="date" name="date" placeholder="Data.."
          onChange={(event) => {
            setDate(event.target.value);
          }}>
        </input>
        <div className='Date'>
        <LocalizationProvider dateAdapter={DateFNSUtils}>
        <DatePicker
          value={value}
          onChange={(newValue) => {
            console.log(newValue.toUTCString());
            setValue(newValue);
          }}
          renderInput={(startProps) => (
            <React.Fragment>
              <TextField {...startProps} />
            </React.Fragment>
          )}
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
        <Button variant="outlined" onClick={handleClickOpen}>
          Dodaj ciężarówkę
        </Button>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Dodawanie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Dodaj numer rejestracyjny oraz datę ważności przeglądu technicznego:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="np. WE1928N"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Anuluj</Button>
          <Button onClick={handleClose}>Dodaj</Button>
        </DialogActions>
        </Dialog>
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
