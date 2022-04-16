import React from 'react'

const TransportEdit = () => {
  return (
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
      <input type="submit" value="Submit"></input>
    </form>
  )
}

export default TransportEdit