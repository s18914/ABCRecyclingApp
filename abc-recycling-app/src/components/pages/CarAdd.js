import React from 'react';
import { useState, useEffect } from "react";
import Axios from "../../request";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle } from 'react-icons/fa'

function CarAdd() {
  const [car, setCar] = useState();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [overviewDate, setOverviewDate] = useState(new Date());

  const {id} = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);
  const navigate = useNavigate();

  const getCar = (id) => {
    if(!isAddMode) {
      Axios.get(`/car/${id}`).then((response) => {
        setCar(response.data);
        setRegistrationNumber(response.data?.registrationNumber);
        setOverviewDate(response.data?.overviewDate);
      });
    }
  };

  useEffect(() => {
    getCar({id}.id);
  }, []);

  const addCar = (event) => {
    event.preventDefault();
    Axios.post('/carCreate', {
      registrationNumber: registrationNumber, 
      overviewDate: overviewDate
    }).then((data) => {
      console.log("success", data.data);
      navigate("/cars");
    })
  };

  const updateCar = (e) => {
    e.preventDefault();
    Axios.put('/carUpdate', {
      registrationNumber: registrationNumber, 
      overviewDate: overviewDate,
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
        <form>
            <label>Numer Rejestracyjny</label>
            <input type="text" id="registrationNumber" name="registrationNumber" defaultValue={car?.registrationNumber} 
            onChange={(event) => {
                setRegistrationNumber(event.target.value);
            }}>
            </input>
            <label>Data ważności przeglądu</label>
            <input type="date" id="overviewDate" name="overviewDate" defaultValue={car?.overviewDate}
            onChange={(event) => {
                setOverviewDate(event.target.value);
            }}>
            </input>
            <div className='btn-panel' style={{transform: 'scale(4.0)'}}>
              {isAddMode && 
                <FaCheckCircle onClick={addCar} style={{color: 'green', cursor: 'pointer'}}/>
              }
              {!isAddMode &&
                <FaCheckCircle onClick={updateCar} style={{color: 'green', cursor: 'pointer'}} />
              }
            </div>
        </form>
    </div>
  )
}

export default CarAdd
