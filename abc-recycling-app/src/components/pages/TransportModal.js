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
  const [addressLabel, setAddressLabel] = useState({id: 0, label: 'Adres'});

  //Walidacja
  const [formValues, setFormValues] = useState({ address: "", date: "", worker: "", car: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {
    addTransport();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    setFormErrors(validate(formValues));
    setIsSubmitting(true);
    handleClose();
  };

  const validate = (values) => {
    let errors = {};

    if (addressId === 0 || addressId === null) {
      errors.address = "To pole nie może być puste";
    } 

    if (!values.date) {
      errors.date = "To pole nie może być puste";
    } 

    if (workerId === 0 || addressId === null) {
      errors.worker = "To pole nie może być puste";
    } 

    if (carId === 0 || addressId === null) {
      errors.car = "To pole nie może być puste";
    } 
    
    return errors;
  };

  async function handleAddressAdd(val) {
    findAddresses();
    setAddressId(val?.id);
    setAddressLabel(val);
  };

  const addTransport = (event) => {
    
    Axios.post('/transportCreate', {
      address_id: addressId,
      date: date, 
      phone: phone, 
      car_id: carId,
      worker_id: workerId
    }).then((data) => {
      Axios.get(`/lastTransport`).then((response) => {
        props.handleTransportAdd(response.data);
      });
    })
  };

  const findCars = () => {
    Axios('/CarsLookup').then(
      response => {
        setCarList(response.data);
      }
    )
  };

  const findDrivers = () => {
    Axios('/WorkersLookup').then(
      response => {
        setWorkersList(response.data);
      }
    )
  };

  const findAddresses = () => {
    Axios('/addressLookup').then(
      response => {
        setAddressList(response.data);
      }
    )
  };
  

  useEffect(() => {
    if(props.id !== undefined && props !== undefined) setId(props.id)
    findAddresses();

    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submit();
    }
  }, [formErrors]);

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
                  disablePortal
                  id="addressLookup"
                  options={addressList}
                  onChange={(event, newValue) => {
                      setAddressId(newValue?.id);
                      handleChange(event);
                      setAddressLabel(newValue);
                      console.log("tutaj" + newValue);
                  }}
                  value={addressLabel}
                  getOptionLabel={(option) => option.label || ""}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Adres" onChange={(e) => setAddressId(e.target.value)}/>} 
                />
            </div>
            <AddressModal handleAddressAdd={handleAddressAdd}/>
            </div>
            <label className='top-space'>Wybierz datę<span className="required">*</span></label>
            <p className="required"> {formErrors.date} </p>
            <input className='inputStyle' type="date" id="date" name="date"
                onChange={(event) => {
                  setDate(event.target.value);
                  handleChange(event);
                }}>
            </input>

            <label className='top-space'>Wpisz telefon odbiorcy</label>
            <input className='inputStyle' type="text" id="phone" name="phone" 
              onChange={(event) => {
                setPhone(event.target.value);
                handleChange(event);
              }}>
            </input>

            <label className='top-space'>Wybierz ciężarówkę<span className="required">*</span></label>
            <p className="required"> {formErrors.car} </p>
            <div>
            <div style={{display: 'inline-block', verticalAlign: 'middle', marginTop: '10px'}} onClick={findCars}>
                <Autocomplete
                  id="carsLookup"
                  options={carsList}
                  onChange={(event, newValue) => {
                    setCarId(newValue.id);
                    handleChange(event);
                    console.log("tutaj" + newValue);
                  }}
                  getOptionLabel={(option) => option.label}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Ciężarówka" />}
                />
            </div>
            </div>

            <label className='top-space'>Wybierz kierowcę<span className="required">*</span></label>
            <p className="required"> {formErrors.worker} </p>
            <div style={{display: 'inline-block', verticalAlign: 'middle', marginTop: '10px'}} onClick={findDrivers}>
            <Autocomplete
              id="WorkersLookup"
              options={workersList}
              onChange={(event, newValue) => {
                setWorkerId(newValue.id);
                handleChange(event);
              }}
              getOptionLabel={(option) => option.label}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Kierowca" />}
            />
            </div>
                <div className='btn-panel' style={{transform: 'scale(4.0)', margin: '40px 0 20px 0'}}>
                  <ImCancelCircle onClick={handleClose} style={{color: 'grey', cursor: 'pointer', padding: '0 15px'}} />
                  <FaCheckCircle onClick={handleSubmit} style={{color: 'green', cursor: 'pointer'}} />
                </div>
            </form>
        </Box> 
      </Modal>
    </div>
    
  );
}

export default TransportModal;