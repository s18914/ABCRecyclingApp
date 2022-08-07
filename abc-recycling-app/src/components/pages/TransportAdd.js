import React from 'react';
import { useState, useEffect } from "react";
import Axios from "../../request";
import { useParams, useNavigate } from "react-router-dom";
import { ImCancelCircle } from 'react-icons/im'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import { FaCheckCircle, FaPlus } from 'react-icons/fa'
import { format } from 'date-fns'

function TransportAdd() {
  const [carId, setCarId] = useState(0);
  const [workerId, setWorkerId] = useState(0);
  const [addressId, setAddressId] = useState(0);
  const [carsList, setCarList] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const {id} = useParams();
  const navigate = useNavigate();
  let isAddMode = id === undefined;
  const [formValues, setFormValues] = useState({ phone: "", date: format(new Date(), `yyyy-MM-dd`), address_id: 0, car_id: 0, worker_id: 0 });
  const [formErrors, setFormErrors] = useState(null);

  const submit = () => {
    console.log(formValues);
    isAddMode ? addTransport() : updateTransport();
  };

  useEffect(() => {
    if (id) {
      getTransport(id)
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    const errors = validate(formValues)
    setFormErrors(errors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues)
    setFormErrors(errors);
    navigate("/transports");
    if (!errors) {
      submit()
    }
  };

  const validate = (values) => {
    let errors = {};

    if (!values.phone) {
      errors.phone = "To pole nie może być puste";
    }

    if (new Date(values.date) < new Date()) {
      errors.date = "Ta data nie może być z przeszłosci";
    }

    return Object.entries(errors).length > 0 ? errors : null;
  };

  const getTransport = async (id) => {
    if (!isAddMode) {
      try {
        const response = await Axios.get(`/transport/${id}`)
        const { phone, date, address_id, car_id, worker_id } = response.data
        const newFormValues = {
          phone,
          date: format(new Date(date), `yyyy-MM-dd`),
          address_id,
          car_id,
          worker_id
        }
        setFormValues(newFormValues)
      } catch (error) {

      }
    }
  };

  const addTransport = async () => {
    const response = await Axios.post('/transportCreate', { ...formValues, date: new Date(formValues.date) })
    console.log("success", response.data);
    if (false) {
      navigate("/transports");
    }
  };

  const updateTransport = async () => {
    const response = await Axios.put('/transportUpdate', {
      ...formValues,
      date: new Date(formValues.date),
      id
    })
    console.log("success", response.data);
    if (false) {
      navigate("/transports");
    }
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
      {isAddMode && <h1>Dodaj nowy transport</h1>}
      {!isAddMode && <h1>Edytuj transport</h1>}
      <form>
        <div className='simpleForm' onSubmit={handleSubmit} noValidate>
          <label htmlFor='date'>Wybierz datę<span className="required">*</span></label>
          <input type="date" id="date" name="date" min={format(new Date(), `yyyy-MM-dd`)} value={formValues.date} onChange={handleChange}>
          </input>
          <p className="required"> {formErrors?.date} </p>

          <label htmlFor='phone'>Wpisz telefon odbiorcy</label>
          <input type="text" id="phone" name="phone" value={formValues.phone} onChange={handleChange}>
          </input>
        </div>
        <p className="required"> {formErrors?.phone} </p>

        <div>
          <label htmlFor='address_id'>Wybierz adres</label>
          <div onClick={findAddresses}>
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
          <FaPlus style={{ verticalAlign: 'middle', margin: '5px', fontSize: '20px' }} title='Dodaj nowy adres' className='icon'> </FaPlus>


          <label htmlFor='car_id'>Wybierz ciężarówkę</label>
          <div onClick={findCars}>
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
            <FaPlus style={{ verticalAlign: 'middle', margin: '5px', fontSize: '20px' }} title='Dodaj nową ciężarówkę' className='icon'> </FaPlus>
          </div>

          <label htmlFor='worker_id'>Wybierz kierowcę</label>
          <div onClick={findDrivers}>
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

        <div className='btn-panel' style={{ transform: 'scale(4.0)' }}>
          <ImCancelCircle style={{ color: 'grey', cursor: 'pointer', padding: '0 15px' }} onClick={() => { navigate("/transports") }} />
          <FaCheckCircle onClick={handleSubmit} style={{ color: 'green', cursor: 'pointer' }} />
        </div>
      </form>
    </div>
  )
}

export default TransportAdd
