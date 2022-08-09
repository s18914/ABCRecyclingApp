import React, { useEffect, useMemo } from 'react'
import { useState } from "react";
import Axios from "../../request";
import { useParams, useNavigate } from 'react-router';
import { ImCancelCircle} from 'react-icons/im'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FaCheckCircle } from 'react-icons/fa'


function WorkerAdd() {
  // const [role_id, setRoleId] = useState(0);
  const [rolesList, setRolesList] = useState([]);
  const {id} = useParams();
  const navigate = useNavigate();
  let isAddMode = id === undefined;
  const [formValues, setFormValues] = useState({ name: "", surname: "", id_number: "", role_id: -1 });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    Axios('/roles').then(
      response => {
        setRolesList(response.data);
      }
    )
  }, [])


  const selectedRole = useMemo(() => rolesList.find(({ id }) => id == formValues.role_id) || null, [formValues, rolesList])

  const submit = () => {
    isAddMode ? addWorker() : updateWorker();
  };

  useEffect(() => {
    if (id) {
      getWorker(id)
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    const errors  = validate(formValues)
    setFormErrors(errors);
  };

  const handleAutocompleteChange = (value, fieldName) => {
    setFormValues({ ...formValues, [fieldName]: value });
    const errors = validate(formValues)
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
    const numberRegex = /[0-9]*/;
    const idRegex = /([a-z]|[A-Z]){3}[0-9]{6}/;

    if (!values.name) {
      errors.name = "To pole nie może być puste";
    } 

    if (!values.surname) {
      errors.surname = "To pole nie może być puste";
    } 

    if (!values.id_number) {
      errors.id_number = "To pole nie może być puste";
    }else if ((!numberRegex.test(values.id_number) && values.id_number.length !== 10) || !idRegex.test(values.id_number)) {
      errors.id_number = "Numer dowodu powinien składać się z 3 liter oraz 6 cyfr i mieć format: AAAA000000";
    }

    if (!values.role_id) {
      errors.role_id = "To pole nie może być puste";
    } 
    
    return Object.entries(errors).length > 0 ?  errors : null;
  };

  const getWorker = async (id) => {
    if (!isAddMode) {
      try {
        //debugger;
        const response = await Axios.get(`/worker/${id}`)
        //Destrukturyzacja => z obiektu response wybiera klucze 
        const { name, surname, id_number, role_id } = response.data
        const newFormValues = {
          name,
          surname,
          id_number,
          role_id
        }
        setFormValues(newFormValues)
      } catch (error) {

      }
    }
  };

  const addWorker = async () => {
    const response = await Axios.post('/workerCreate', {...formValues})
    console.log("success", response.data);
    if (false) { 
      navigate("/workers");
    }
  };

  const updateWorker = async () => {
    const response = await Axios.put('/workerUpdate', {
      ...formValues,
      id
    })
    console.log("success", response.data);
    if (false) {
      navigate("/workers");
    }
  };



  return (
    <div className='main'>
      {isAddMode &&<h1>Dodaj nowego pracownika</h1>}
      {!isAddMode && <h1>Edytuj pracownika</h1>}
        <form>
          <div className='simpleForm' style={{width: '300px'}} onSubmit={handleSubmit} noValidate>
            <label htmlFor='name'>Imię<span className="required">*</span></label>
            <input type="text" id="name" name="name" value={formValues.name} 
            onChange={handleChange}>
                      </input>
          <p className="required"> {formErrors?.name} </p>
          <label htmlFor='surname'>Nazwisko<span className="required">*</span></label>
          <input type="text" id="surname" name="surname" maxlength='27' value={formValues.surname}
            onChange={handleChange}>
          </input>
          <p className="required"> {formErrors?.surname} </p>
          <label htmlFor='id_number'>Numer dowodu<span className="required">*</span></label>
          <input type="text" id="id_number" name="id_number" maxlength='9' value={formValues.id_number}
            onChange={handleChange}>
          </input>
          <p className="required"> {formErrors?.id_number} </p>
        </div>
        <div>
          <label htmlFor='role_id'>Stanowisko pracownika<span className="required">*</span></label>
          <div>
            <Autocomplete
              id="role_id"
              options={rolesList}
              onChange={(_, value) => {
                // debugger;
                handleAutocompleteChange(value?.id, 'role_id')
              }}
              value={selectedRole}
              getOptionLabel={(option) => option?.label || ''}
              isOptionEqualToValue={(option, value) => option.id == value.id}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Stanowisko" />}
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
