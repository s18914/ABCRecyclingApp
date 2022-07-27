import React from 'react';
import { useState, useEffect } from "react";
import Axios from "../../request";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaAngleLeft } from 'react-icons/fa'
import { ImCancelCircle} from 'react-icons/im'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function AddressAdd() {
  const [address, setAddress] = useState();
  const [street, setSreet] = useState("");
  const [houseNumber, setHouseNumber] = useState(0);
  const [flatNumber, setFlatNumber] = useState(0);
  const [zipCodeId, setZipCodeId] = useState("");
  const [zipCodesList, setZipCodesList] = useState([]);

  const {id} = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);
  const navigate = useNavigate();

  const getAddress = (id) => {
    if(!isAddMode) {
      Axios.get(`/address/${id}`).then((response) => {
        setAddress(response.data);
        setSreet(response.data?.street);
        setHouseNumber(response.data?.houseNumber);
        setFlatNumber(response.data?.flatNumber);
      });
    }
  };

  useEffect(() => {
    getAddress({id}.id);
  }, []);

  const addAddress = (event) => {
    event.preventDefault();
    Axios.post('/addressCreate', {
      street: street, 
      houseNumber: houseNumber,
      flatNumber: flatNumber,
      zipCodeId: zipCodeId
    }).then((data) => {
      console.log("success", data.data);
      navigate("/transports/add");
    })
  };

  const updateAddress = (e) => {
    e.preventDefault();
    Axios.put('/addressUpdate', {
      street: street, 
      houseNumber: houseNumber,
      flatNumber: flatNumber,
      id: {id}.id
    }).then((data) => {
      console.log("success", data.data);
      navigate("/addresses");
    });
  };

  const findZipCodes = () => {
    Axios('/ZipCodesLookup').then(
      response => {
        setZipCodesList(response.data);
      }
    )
  };

  return (
    <div className='main'>
        {isAddMode &&<h1>Dodaj nowy adres</h1>}
        {!isAddMode && <h1>Edytuj adres</h1>}
        <FaAngleLeft onClick={() => {navigate("/addresses")}} style={{color: 'green', cursor: 'pointer'}} />
        <form className='simpleForm'>
            <label>Ulica</label>
            <input type="text" id="street" name="street" defaultValue={address?.street} 
            onChange={(event) => {
                setSreet(event.target.value);
            }}>
            </input>
            <label>Numer domu</label>
            <input type="number" id="houseNumber" name="houseNumber" defaultValue={address?.houseNumber}
            onChange={(event) => {
                setHouseNumber(event.target.value);
            }}>
            </input>
            <label>Numer Lokalu</label>
            <input type="number" id="flatNumber" name="flatNumber" defaultValue={address?.houseNumber}
            onChange={(event) => {
                setFlatNumber(event.target.value);
            }}>
            </input>
            <div>
            <br />
            <div onClick={findZipCodes}>
              <Autocomplete
                id="ZipCodesLookup"
                options={zipCodesList}
                onChange={(event, value) => {
                  setZipCodeId(value.id);
                }}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Kod pocztowy" />}
              />
            </div>
            </div>
            <div className='btn-panel' style={{transform: 'scale(4.0)'}}>
              <ImCancelCircle style={{color: 'grey', cursor: 'pointer', padding: '0 15px'}} onClick={() => {navigate("/addresses")}}/>
              {isAddMode && <FaCheckCircle onClick={addAddress} style={{color: 'green', cursor: 'pointer'}}/>}
              {!isAddMode && <FaCheckCircle onClick={updateAddress} style={{color: 'green', cursor: 'pointer'}} />}
            </div>
        </form>
    </div>
  )
}

export default AddressAdd
