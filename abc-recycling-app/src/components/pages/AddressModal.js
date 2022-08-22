import React, { useEffect } from 'react'
import { useState } from "react";
import Axios from "../../request";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { ImCancelCircle} from 'react-icons/im'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FaCheckCircle} from 'react-icons/fa'

function AddressModal({...props}) {
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState(undefined);

  const [address, setAddress] = useState();
  const [street, setSreet] = useState("");
  const [house_number, setHouseNumber] = useState(0);
  const [flat_number, setFlatNumber] = useState(0);
  const [zip_code_id, setZipCodeId] = useState(0);
  const [zipCodesList, setZipCodesList] = useState([]);

  const [formValues, setFormValues] = useState({ street: "", house_number: 0, zip_code_id: 0});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {
    addAddress();
  };

  const handleChange = (e) => {
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

    if (!values.street) {
      errors.street = "To pole nie może być puste";
    } 

    if (!values.house_number) {
      errors.house_number = "To pole nie może być puste";
    } 

    if (zip_code_id === 0) {
      errors.zip_code_id = "To pole nie może być puste";
    } 

    return errors;
  };

  const addAddress = (event) => {
    Axios.post('/addressCreate', {
      street: street, 
      house_number: house_number,
      flat_number: flat_number,
      zip_code_id: zip_code_id
    }).then((data) => {
      Axios.get(`/lastAddress`).then((response) => {
        props.handleAddressAdd(response.data);
      });
      handleClose();
    })
  };

  const findZipCodes = () => {
    Axios('/ZipCodesLookup').then(
      response => {
        setZipCodesList(response.data);
      }
    )
  };
  

  useEffect(() => {
    if(props.id !== undefined && props !== undefined) setId(props.id)

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
        >Dodaj nowy adres
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="dodanie nowego adresu"
      >
        <Box className='smallModal modal'>
          <h3>Dodaj adres</h3>
          <form>
            <label>Ulica<span className="required">*</span></label>
            <p className="required"> {formErrors.street} </p>
            <input className='inputStyle' type="text" id="street" name="street" defaultValue={address?.street} 
            onChange={(event) => {
                setSreet(event.target.value);
                handleChange(event);
            }}>
            </input>
            <label className='top-space'>Numer domu<span className="required">*</span></label>
            <p className="required"> {formErrors.house_number} </p>
            <input className='inputStyle' type="number" id="house_number" name="house_number" defaultValue={address?.house_number}
            onChange={(event) => {
                setHouseNumber(event.target.value);
                handleChange(event);
            }}>
            </input>
            <label className='top-space'>Numer Lokalu</label>
            <input className='inputStyle' type="number" id="flat_number" name="flat_number" defaultValue={address?.flat_number}
            onChange={(event) => {
                setFlatNumber(event.target.value);
            }}>
            </input>
            <label className='top-space'>Kod pocztowy<span className="required">*</span></label>
            <p className="required"> {formErrors.zip_code_id} </p>
            <div onClick={findZipCodes}>
              <Autocomplete
                id="ZipCodesLookup"
                options={zipCodesList.sort()}
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

export default AddressModal;