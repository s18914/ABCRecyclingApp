import React, { useEffect } from 'react'
import { useState } from "react";
import Axios from "../../request";
import { useParams, useNavigate } from 'react-router';
import { ImCancelCircle} from 'react-icons/im'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FaCheckCircle } from 'react-icons/fa'


function WorkerAdd() {
  const [worker, setWorker] = useState();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [id_number, setIdNumber] = useState("");
  const [role_id, setRoleId] = useState(0);
  const [rolesList, setRolesList] = useState([]);

  const {id} = useParams();
  const navigate = useNavigate();
  let isAddMode = ({id}.id === undefined ? true : false);

  const [formValues, setFormValues] = useState({ name: "", surname: "", id_number: "", role_id: 0});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {
    if(isAddMode) addWorker();
    updateWorker();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmitting(true);
    navigate("/workers");
  };

  const validate = (values) => {
    let errors = {};
    const numberRegex = /[0-9]*/;
    const idRegex = /([a-z]|[A-Z]){4}[0-9]{6}/;

    if (!values.name) {
      errors.name = "To pole nie może być puste";
    } 

    if (!values.surname) {
      errors.surname = "To pole nie może być puste";
    } 

    if (!values.id_number) {
      errors.id_number = "To pole nie może być puste";
    }else if ((!numberRegex.test(values.id_number) && values.id_number.length !== 10) || !idRegex.test(values.id_number)) {
      errors.id_number = "Numer dowodu powinien składać się z 4 liter oraz 6 cyfr i mieć format: AAAA000000";
    }

    if (!values.role_id) {
      errors.role_id = "To pole nie może być puste";
    } 
    
    return errors;
  };

  const getWorker = (id) => {
    if(!isAddMode) {
      Axios.get(`/worker/${id}`).then((response) => {
        setWorker(response.data);
        setName(response.data?.name);
        setSurname(response.data?.surname);
        setIdNumber(response.data?.id_number);
        setRoleId(response.data?.role_id);
      });
    }
  };

  useEffect(() => {
    getWorker({id}.id);
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submit();
    }
  }, [formErrors]);

  const addWorker = (event) => {
    Axios.post('/workerCreate', {
      name: name, 
      surname: surname, 
      id_number: id_number,
      role_id: role_id
    }).then((data) => {
      navigate("/workers");
    })
  };

  const updateWorker = (e) => {
    Axios.put('/workerUpdate', {
      name: name, 
      surname: surname,
      id_number: id_number,
      role_id: role_id
    }).then((response) => {
      navigate("/workers");
    });
  };

  const findOptions = () => {
    Axios('/roles').then(
      response => {
        setRolesList(response.data);
      }
    )
  };

  return (
    <div className='main'>
      {isAddMode &&<h1>Dodaj nowego pracownika</h1>}
      {!isAddMode && <h1>Edytuj pracownika</h1>}
        <form>
          <div className='simpleForm' style={{width: '300px'}} onSubmit={handleSubmit} noValidate>
            <label>Imię<span className="required">*</span></label>
            <input type="text" id="name" name="name" defaultValue={worker?.name} 
            onChange={(event) => {
                setName(event.target.value);
                handleChange(event);
            }}>
            </input>
            <p className="required"> {formErrors.name} </p>
            <label>Nazwisko<span className="required">*</span></label>
            <input type="text" id="surname" name="surname" defaultValue={worker?.surname} 
            onChange={(event) => {
                setSurname(event.target.value);
                handleChange(event);
            }}>
            </input>
            <p className="required"> {formErrors.surname} </p>
            <label>Numer dowodu<span className="required">*</span></label>
            <input type="text" id="id_number" name="id_number" defaultValue={worker?.id_number} 
            onChange={(event) => {
                setIdNumber(event.target.value);
                handleChange(event);
            }}>
            </input>
            <p className="required"> {formErrors.id_number} </p>
            </div>
            <div>
            <label>Stanowisko pracownika<span className="required">*</span></label>
            <div onClick={findOptions}>
              <Autocomplete
                id="role_id"
                options={rolesList}
                onChange={(event) => {
                  setRoleId(event.target.value.id);
                  handleChange(event);
                }}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Stanowisko" />}
                defaultValue={worker?.role_id}
              />
            </div>
            </div>
          <div className='btn-panel' style={{transform: 'scale(4.0)'}}>
            <ImCancelCircle style={{color: 'grey', cursor: 'pointer', padding: '0 15px'}} onClick={() => {navigate("/workers")}}/>
            <FaCheckCircle onClick={handleSubmit} style={{color: 'green', cursor: 'pointer'}}/>
          </div>
        </form>
    </div>
  )
}

export default WorkerAdd
