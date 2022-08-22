import React from 'react';
import { useState, useEffect, useMemo } from "react";
import Axios from "../../request";
import { useParams, useNavigate } from "react-router-dom";
import { ImCancelCircle } from 'react-icons/im'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FaCheckCircle, FaPlus } from 'react-icons/fa'
import { format } from 'date-fns'

function TransportAdd() {
  const [carsList, setCarList] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  let isAddMode = id === undefined;
  const [formValues, setFormValues] = useState({ phone: "", date: format(new Date(), `yyyy-MM-dd`), address_id: 0, car_id: 0, worker_id: 0 });
  const [formErrors, setFormErrors] = useState(null);

  useEffect(() => {
    Axios('/addressLookup').then(
      response => {
        setAddressList(response.data);
      }
    )
  }, [])

  useEffect(() => {
    Axios('/WorkersLookup').then(
      response => {
        setWorkersList(response.data);
      }
    )
  }, [])

  useEffect(() => {
    Axios('/CarsLookup').then(
      response => {
        setCarList(response.data);
      }
    )
  }, [])

  const selectedAddress = useMemo(() => addressList.find(({ id }) => id === formValues.address_id) || null, [formValues, addressList])
  const selectedWorker = useMemo(() => workersList.find(({ id }) => id === formValues.worker_id) || null, [formValues, workersList])
  const selectedCar = useMemo(() => carsList.find(({ id }) => id === formValues.car_id) || null, [formValues, carsList])

  const submit = () => {
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

  const handleAutocompleteChange = (value, fieldName) => {
    setFormValues({ ...formValues, [fieldName]: value });
    const errors = validate(formValues)
    setFormErrors(errors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues)
    setFormErrors(errors);
    if (!errors) {
      submit()
    }
  };

  const validate = (values) => {
    let errors = {};
    const phoneRegex = /([0-9]){9}/;

    if (!values.address_id) {
      errors.address_id = "To pole nie może być puste";
    }
    if (!values.car_id) {
      errors.car_id = "To pole nie może być puste";
    }
    if (!values.worker_id) {
      errors.worker_id = "To pole nie może być puste";
    }
    
    if (!phoneRegex.test(values.phone) && values.phone !== 9) {
      errors.phone = "Numer telefonu powinien składać się z samych cyfr i mieć max 10 znaków.";
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
    const response = await Axios.post('/transportCreate', {
      ...formValues,
      date: new Date(formValues.date)
    }).then((response) => {
      navigate("/transports");
    })
  };

  const updateTransport = async () => {
    const response = await Axios.put('/transportUpdate', {
      ...formValues,
      date: new Date(formValues.date),
      id
    }).then((response) => {
      navigate("/transports");
    })
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
          <input type="text" id="phone" name="phone" maxLength='9' value={formValues.phone} onChange={handleChange}>
          </input>
        </div>
        <p className="required"> {formErrors?.phone} </p>

        <div>
          <label htmlFor='address_id'>Wybierz adres<span className="required">*</span></label>
          <div>
            <Autocomplete
              id="address_id"
              options={addressList}
              onChange={(_, value) => {
                handleAutocompleteChange(value?.id, 'address_id')
              }}
              value={selectedAddress}
              getOptionLabel={(option) => option?.label || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Adres" />}
            />
          </div>
          <p className="required"> {formErrors?.address_id} </p>

          <label htmlFor='car_id'>Wybierz ciężarówkę<span className="required">*</span></label>
          <div>
            <Autocomplete
              id="car_id"
              options={carsList}
              onChange={(_, value) => {
                handleAutocompleteChange(value?.id, 'car_id')
              }}
              value={selectedCar}
              getOptionLabel={(option) => option?.label || ''}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Ciężarówka" />}
            />
          </div>
          <p className="required"> {formErrors?.car_id} </p>

          <label htmlFor='worker_id'>Wybierz kierowcę<span className="required">*</span></label>
          <div>
            <Autocomplete
              id="worker_id"
              options={workersList}
              onChange={(_, value) => {
                handleAutocompleteChange(value?.id, 'worker_id')
              }}
              value={selectedWorker}
              getOptionLabel={(option) => option?.label || ''}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Kierowca" />}
            />
          </div>
          <p className="required"> {formErrors?.worker_id} </p>

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
