import React from 'react';
import { useState, useEffect } from "react";
import Axios from "../../request";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle } from 'react-icons/fa'
import { ImCancelCircle } from 'react-icons/im'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function AddressAdd() {
  const [zip_code_id, setZipCodeId] = useState(0);
  const [zipCodesList, setZipCodesList] = useState([]);
  const { id } = useParams();
  let isAddMode = id === undefined;
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ street: "", house_number: 0, flat_number: 0, zip_code_id: 0 });
  const [formErrors, setFormErrors] = useState(null);

  const submit = () => {
    console.log(formValues);
    isAddMode ? addAddress() : updateAddress();
  };

  useEffect(() => {
    if (id) {
      getAddress(id)
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
    if (!errors) {
      submit()
    }
  };

  const validate = (values) => {
    let errors = {};

    if (!values.street) {
      errors.street = "To pole nie może być puste";
    }

    if (!values.house_number) {
      errors.house_number = "To pole nie może być puste";
    }

    if (!values.zip_code_id) {
      errors.zip_code_id = "To pole nie może być puste";
    }

    return errors;
  };

  const getAddress = async (id) => {
    if (!isAddMode) {
      try {
        const response = await Axios.get(`/address/${id}`)
        const { street, house_number, flat_number, zip_code_id } = response.data
        const newFormValues = {
          street,
          house_number,
          flat_number,
          zip_code_id
        }
        setFormValues(newFormValues)
      } catch (error) {

      }
    }
  };

  const addAddress = async () => {
    const response = await Axios.post('/carCreate', { ...formValues })
    console.log("success", response.data);
    if (false) {
      navigate("/addresses");
    }
  };

  const updateAddress = async () => {
    const response = await Axios.put('/addressUpdate', {
      ...formValues,
      id
    })
    console.log("success", response.data);
    if (false) {
      navigate("/addresses");
    }
  };

  const findZipCodes = () => {
    Axios('/ZipCodesLookup').then(
      response => {
        setZipCodesList(response.data || []);
      }
    )
  };

  return (
    <div className='main'>
      {isAddMode && <h1>Dodaj nowy adres</h1>}
      {!isAddMode && <h1>Edytuj adres</h1>}
      <form onSubmit={handleSubmit} noValidate>
        <div className='simpleForm' style={{ width: '300px' }}>
          <label htmlFor='street'>Ulica<span className="required">*</span></label>
          <input type="text" id="street" name="street" maxlength='70' value={formValues.street} onChange={handleChange}>
          </input>
          <label htmlFor='house_number'>Numer domu<span className="required">*</span></label>
          <input type="number" id="house_number" name="house_number" value={formValues.house_number} onChange={handleChange}>
          </input>
          <label htmlFor='flat_number'>Numer Lokalu</label>
          <input type="number" id="flat_number" name="flat_number" value={formValues.flat_number} onChange={handleChange}>
          </input>
        </div>
        <div>
          <label htmlFor='ZipCodesLookup'>Kod pocztowy<span className="required">*</span></label>
          <div onClick={findZipCodes}>
            <Autocomplete
              id="ZipCodesLookup"
              options={zipCodesList}
              onChange={(event, value) => {
                setZipCodeId(value.id);
                handleChange(event);
              }}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Kod pocztowy" />}
            />
          </div>
        </div>
        <div className='btn-panel' style={{ transform: 'scale(4.0)' }}>
          <ImCancelCircle style={{ color: 'grey', cursor: 'pointer', padding: '0 15px' }} onClick={() => { navigate("/addresses") }} />
          <FaCheckCircle onClick={handleSubmit} style={{ color: 'green', cursor: 'pointer' }} />
        </div>
      </form>
    </div>
  )
}

export default AddressAdd
