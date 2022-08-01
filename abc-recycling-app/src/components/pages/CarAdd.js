import React from 'react';
import { useState, useEffect } from "react";
import Axios from "../../request";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle } from 'react-icons/fa'
import { ImCancelCircle} from 'react-icons/im'

function CarAdd() {
  const [car, setCar] = useState();
  const [registration_number, setRegistrationNumber] = useState("");
  const [overview_date, setOverviewDate] = useState(new Date());

  const {id} = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({ registration_number: ""});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {
    console.log(formValues);
    if(isAddMode) addCar();
    updateCar();
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
    const numberRegex = /[0-9]*/;

    if (!values.registration_number) {
      errors.street = "To pole nie może być puste";
    } 

    return errors;
  };

  useEffect(() => {
    getCar({id}.id);
  }, []);
  

  const getCar = (id) => {
    if(!isAddMode) {
      Axios.get(`/car/${id}`).then((response) => {
        setCar(response.data);
        setRegistrationNumber(response.data?.registration_number);
        setOverviewDate(response.data?.overview_date);
      });
    }
  };

  const addCar = (event) => {
    event.preventDefault();
    Axios.post('/carCreate', {
      registration_number: registration_number, 
      overview_date: overview_date
    }).then((data) => {
      console.log("success", data.data);
      navigate("/transports/add");
    })
  };

  const updateCar = (e) => {
    e.preventDefault();
    Axios.put('/carUpdate', {
      registration_number: registration_number, 
      overview_date: overview_date,
      id: {id}.id
    }).then((data) => {
      console.log("success", data.data);
      navigate("/cars");
    });
  };

  return (
    <div className='main'>
        {isAddMode &&<h1>Dodaj nowy samochód</h1>}
        {!isAddMode && <h1>Edytuj samochód</h1>}
        <form className='simpleForm' onSubmit={handleSubmit} noValidate>
            <label>Numer Rejestracyjny<span className="required">*</span></label>
            <input type="text" id="registration_number" name="registration_number" defaultValue={car?.registration_number} 
            onChange={(event) => {
                setRegistrationNumber(event.target.value);
                handleChange(event);
            }}>
            </input>
            <label>Data ważności przeglądu</label>
            <input type="date" id="overview_date" name="overview_date" defaultValue={car?.overview_date}
            onChange={(event) => {
                setOverviewDate(event.target.value);
            }}>
            </input>
            <div className='btn-panel' style={{transform: 'scale(4.0)'}}>
              <ImCancelCircle style={{color: 'grey', cursor: 'pointer', padding: '0 15px'}} onClick={() => {navigate("/cars")}}/>
              {isAddMode && <FaCheckCircle onClick={addCar} style={{color: 'green', cursor: 'pointer'}}/>}
              {!isAddMode && <FaCheckCircle onClick={updateCar} style={{color: 'green', cursor: 'pointer'}} />}
            </div>
        </form>
    </div>
  )
}

export default CarAdd
