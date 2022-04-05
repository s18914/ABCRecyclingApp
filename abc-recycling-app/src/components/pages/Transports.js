import React from 'react'
import Button from '../Button'

const Transports = () => {
  return (
    <>
      <div className='main'>
      <table cellspacing="30" cellpadding="20" RULES="rows">
            <h2>Lista transportów</h2>
            <tr class="table-list strong-list">
                <td><input type="checkbox"/></td>
                <td><strong>Lp</strong></td>
                <td><strong>Adres</strong></td>
                <td><strong>Data</strong></td>
                <td><strong>Numer telefonu</strong></td>
                <td><strong>Status</strong></td>
            </tr>
            <tr>
                <td><input type="checkbox"/></td>
                <td>1</td>
                <td>Jutrzenki 7a/44 Warszawa</td>
                <td>01.01.2022</td>
                <td>515 765 543</td>
                <td>Planowany</td>
            </tr>
            <tr>
                <td><input type="checkbox"/></td>
                <td>2</td>
                <td>Jutrzenki 7a/44 Warszawa</td>
                <td>01.01.2022</td>
                <td>515 765 543</td>
                <td>Planowany</td>
            </tr>
            <tr>
                <td><input type="checkbox"/></td>
                <td>3</td>
                <td>Jutrzenki 7a/44 Warszawa</td>
                <td>01.01.2022</td>
                <td>515 765 543</td>
                <td>Planowany</td>
            </tr>
        </table>
        <div className='btn-panel'>
          <Button color={'green'} text={'Dodaj'}/>
          <Button color={'red'} text={'Usuń'}/>
          <Button color={'blue'} text={'Edytuj'}/>
        </div>
      </div>
      
    </>
  )
}

export default Transports