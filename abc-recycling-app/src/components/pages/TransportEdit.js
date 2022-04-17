import React from 'react'
import Button from '../Button'

const TransportEdit = () => {
  return (
    <div className='main'>
      <h1>Dodaj nowy transport</h1>
      <form>
        <label>Wybierz datę</label>
        <input type="text" id="date" name="date" placeholder="Data.."></input>
        <label>Wpisz telefon odbiorcy</label>
        <input type="text" id="phone" name="phone" placeholder="Telefon.."></input>
        <label>Wpisz adres</label>
        <input type="text" id="address" name="address" placeholder="Adres.."></input>
        <label>Wybierz ciężarówkę</label>
        <select>
          <option value="Ford 1">ford XYUD825</option>
          <option value="Ford 2">ford XZUD825</option>
        </select>
        <div className='btn-panel'>
          <Button type="submit" color={'green'} text={'Dodaj'} to={'/transports'}></Button>
          <Button type="submit" color={'red'} text={'Anuluj'} to={'/transports'}></Button>
        </div>
      </form>
    </div>
  )
}

export default TransportEdit