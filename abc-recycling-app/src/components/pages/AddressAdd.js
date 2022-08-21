import React from 'react';
import { useState, useEffect, useMemo } from "react";
import Axios from "../../request";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle } from 'react-icons/fa'
import { ImCancelCircle } from 'react-icons/im'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function AddressAdd() {
  const [zipCodesList, setZipCodesList] = useState([]);
  const { id } = useParams();
  let isAddMode = id === undefined;
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ street: "", house_number: 0, flat_number: 0, zip_code_id: -1 });
  const [formErrors, setFormErrors] = useState(null);

  useEffect(() => {
    Axios('/ZipCodesLookup').then(
      response => {
        setZipCodesList(response.data);
      }
    )
  }, [])

  const selectedZipCode = useMemo(() => zipCodesList.find(({ id }) => id == formValues.zip_code_id) || null, [formValues, zipCodesList])

  const submit = () => {
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

    if (!values.street) {
      errors.street = "To pole nie może być puste";
    }

    if (!values.house_number) {
      errors.house_number = "To pole nie może być puste";
    }

    if (!values.zip_code_id) {
      errors.zip_code_id = "To pole nie może być puste";
    }

    return Object.entries(errors).length > 0 ? errors : null;
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
    const response = await Axios.post('/addressCreate', {
      ...formValues
    }).then((response) => {
      navigate("/addresses");
    })
  };

  const updateAddress = async () => {
    const response = await Axios.put('/addressUpdate', {
      ...formValues,
      id
    }).then((response) => {
      navigate("/addresses");
    })
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
          <input type="number" id="house_number" name="house_number" min="1" value={formValues.house_number} onChange={handleChange}>
          </input>
          <label htmlFor='flat_number'>Numer Lokalu</label>
          <input type="number" id="flat_number" name="flat_number" min="1" value={formValues.flat_number} onChange={handleChange}>
          </input>
        </div>
        <div>
          <label htmlFor='ZipCodesLookup'>Kod pocztowy<span className="required">*</span></label>
          <div>
            <Autocomplete
              id="zip_code_id"
              options={zipCodesList}
              onChange={(_, value) => {
                handleAutocompleteChange(value?.id, 'zip_code_id')
              }}
              value={selectedZipCode}
              getOptionLabel={(option) => option?.label || ''}
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
