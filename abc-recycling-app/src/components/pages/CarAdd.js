import React from 'react';
import { useState, useEffect } from "react";
import Axios from "../../request";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle } from 'react-icons/fa'
import { ImCancelCircle } from 'react-icons/im'
import { format } from 'date-fns'


function CarAdd() {
  const { id } = useParams();
  let isAddMode = id === undefined;
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ registration_number: "", overview_date: format(new Date(), `yyyy-MM-dd`) });
  const [formErrors, setFormErrors] = useState(null);
  const [carsRegistrationNumbers, setCarsRegistrationNumbers] = useState([]);

  const submit = () => {
    isAddMode ? addCar() : updateCar();
  };

  useEffect(() => {
    (async () => {
      try {
        const responseCars = await Axios.get(`/cars`)
        const {data: carsData} = responseCars
        const filteredCarsList = carsData.filter(({car_id}) => car_id !== id);
        const filteredCarsRegistrationNumbers = filteredCarsList.map(({registration_number}) => registration_number) 
        setCarsRegistrationNumbers(filteredCarsRegistrationNumbers)
      } catch (error) {

      }
    })()
  }, []);

  useEffect(() => {
    if (id) {
      getCar(id)
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formValues, [name]: value };
    setFormValues(newFormData);
    const errors = validate(newFormData)
    setFormErrors(errors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors  = validate(formValues)
    setFormErrors(errors);
    if (!errors) { 
      submit()
    }
  };

  const validate = (values) => {
    let errors = {};
    const registrationNumberRegex = /([[A-Z]){1}([A-Z]|[0-9]){5}/;

    if (!values.registration_number) {
      errors.registration_number = "To pole nie może być puste";
    } else if (!registrationNumberRegex.test(values.registration_number) && values.registration_number.length !== 7) {
      errors.registration_number = "Numer rejestracyjny powinien składać się z 7 znaków, z czego pierwsze 2-3 powinny być literami.";
    } else if (carsRegistrationNumbers.some(registration_number => registration_number === values.registration_number.trim())){
      errors.registration_number = "Ten numer rejestacyjny istnieje już w bazie danych.";
    }
    
    if (new Date(values.overview_date) < new Date()) {
      errors.overview_date = "Ta data nie może być z przeszłosci";
    }

    return Object.entries(errors).length > 0 ?  errors : null;
  };

  const getCar = async (id) => {
    if (!isAddMode) {
      try {
        const responseCar = await Axios.get(`/car/${id}`)
        const { overview_date, registration_number } = responseCar.data
        const newFormValues = {
          registration_number,
          overview_date: format(new Date(overview_date), `yyyy-MM-dd`)
        }
        setFormValues(newFormValues)
      } catch (error) {

      }
    }
  };

  const addCar = async () => {
    const response = await Axios.post('/carCreate', {
      ...formValues, 
      overview_date: new Date(formValues.overview_date)
    }).then((response) => {
      navigate("/cars");
    })
  };

  const updateCar = async () => {
    const response = await Axios.put('/carUpdate', {
      ...formValues,
      overview_date: new Date(formValues.overview_date),
      id
    }).then((response) => {
      navigate("/cars");
    })
  };

  return (
    <div className='main'>
      {isAddMode && <h1>Dodaj nowy samochód</h1>}
      {!isAddMode && <h1>Edytuj samochód</h1>}
      <form className='simpleForm' style={{ width: '300px' }} onSubmit={handleSubmit} noValidate>
        <label htmlFor='registration_number'>Numer Rejestracyjny<span className="required">*</span></label>
        <input type="text" id="registration_number" name="registration_number" maxLength='8' value={formValues.registration_number}
          onChange={handleChange}>
        </input>
        <p className="required"> {formErrors?.registration_number} </p>
        <label htmlFor='overview_date'>Data ważności przeglądu</label>
        <input type="date" id="overview_date" name="overview_date" min={format(new Date(), `yyyy-MM-dd`)} value={formValues.overview_date}
          onChange={handleChange}>
        </input>
        <p className="required"> {formErrors?.overview_date} </p>
      </form>
      <div className='btn-panel' style={{ transform: 'scale(4.0)' }}>
        <ImCancelCircle style={{ color: 'grey', cursor: 'pointer', padding: '0 15px' }} onClick={() => { navigate("/cars") }} />
        <FaCheckCircle onClick={handleSubmit} style={{ color: 'green', cursor: 'pointer' }} />
      </div>
    </div>
  )
}

export default CarAdd
