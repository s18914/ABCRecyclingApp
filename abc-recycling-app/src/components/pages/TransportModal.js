import React, { useEffect } from 'react'
import { useState } from "react";
import Axios from "../../request";
import AddressModal from './AddressModal'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { ImCancelCircle} from 'react-icons/im'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FaCheckCircle} from 'react-icons/fa'
import {Link} from 'react-router-dom';

function TransportModal({...props}) {
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState(undefined);

  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [carsList, setCarList] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [carId, setCarId] = useState(0);
  const [workerId, setWorkerId] = useState(0);
  const [addressId, setAddressId] = useState(0);
  const [transport, setTransport] = useState();

  //Walidacja
  const [formValues, setFormValues] = useState({ address: "", date: "", worker: "", car: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {
    console.log(formValues);
    addTransport();
  };

  const handleChange = (e) => {
    console.log(e.target);
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
    
    return errors;
  };

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
  

  useEffect(() => {
    if(props.id !== undefined && props !== undefined) setId(props.id)
  }, [props.id]);

  //modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
  };

  return (
    <div>
        <div
        style={{backgroundColor: '#41B53D', color: 'white', marginTop: '5px', cursor: 'pointer', width: '150px', textAlign: 'center', fontWeight: '600', borderRadius: '3px', padding: '0'}}
        onClick={() => handleOpen()}
        >Dodaj nowy transport
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="Edycja listy produktów"
      >
        <Box className='modal'>
          <h3>Dodaj transport</h3>
          <form>
            <div>
            <label>Wybierz adres<span className="required">*</span></label>
            <p className="required"> {formErrors.address} </p>
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
            <AddressModal />
            </div>
            <label>Wybierz datę<span className="required">*</span></label>
            <p className="required"> {formErrors.date} </p>
            <input className='inputStyle' type="date" id="date" name="date"
                onChange={(event) => {
                setDate(event.target.value);
                }}>
            </input>
            <label>Wpisz telefon odbiorcy</label>
            <input className='inputStyle' type="text" id="phone" name="phone" 
            onChange={(event) => {
            setPhone(event.target.value);
            }}>
            </input>
            <label>Wybierz ciężarówkę<span className="required">*</span></label>
            <p className="required"> {formErrors.car} </p>
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
            </div>

            <label>Wybierz kierowcę<span className="required">*</span></label>
            <p className="required"> {formErrors.worker} </p>
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
                <FaCheckCircle onClick={addTransport} style={{color: 'green', cursor: 'pointer'}} />
                </div>
            </form>
        </Box> 
      </Modal>
    </div>
    
  );
}

export default TransportModal;