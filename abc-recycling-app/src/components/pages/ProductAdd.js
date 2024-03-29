import React from 'react';
import { useState } from "react";
import Axios from "../../request";
import {Link} from 'react-router-dom';
import { useParams } from 'react-router';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function ProductAdd() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");

  const options = ['Folia', 'Papier', 'Metal', 'Inne'];

  const [value, setValue] = React.useState(options[0]);
  const [inputValue, setInputValue] = React.useState('');

  const {id} = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);

  const addProduct = (event) => {
    event.preventDefault();
    Axios.post('/productCreate', {
      name: name, 
      type: type, 
      price: price,
      weight: weight
    }).then((data) => {
      console.log("success", data.data);
    })
  };

  return (
    <div className='main'>
        <h1>Dodaj nowy produkt</h1>
        <form>
            <label>Nazwa</label>
            <input type="text" id="name" name="name" onChange={(event) => {
                setName(event.target.value);
            }}>
            </input>
            <label>Typ</label>
            <div>
            <br />
            <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                id="controllable-states-demo"
                options={options}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Typ" />}
            />
            </div>
            <label>Cena</label>
            <input type="text" id="price" name="price" onChange={(event) => {
                setPrice(event.target.value);
            }}>
            </input>
            <label>Waga</label>
            <input type="text" id="weight" name="weight" onChange={(event) => {
                setWeight(event.target.value);
            }}>
            </input>
        </form>
      <div className='btn-panel'>
        <Link href={'/products'}>
          <button onClick={addProduct}>
            Zatwierdź
          </button>
        </Link> 
        <Link to={'/products'}>
          <button>
            Anuluj
          </button>
        </Link> 
      </div>
    </div>
  )
}

export default ProductAdd
