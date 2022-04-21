import React, { useState } from 'react';
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Transports from './components/pages/Transports';
import TransportEdit from './components/pages/TransportEdit';
//import Sales from './pages/Sales';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' exact element={<Home/>} />
          <Route path='/transports'exact element={<Transports/>} />
          <Route path='/transports/add'exact element={<TransportEdit/>} />
          <Route path='/transports/edit/:id'exact element={<TransportEdit/>} />
          {/* <Route path='/sales' component={Sales} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;

//connectng to database
const express = require('express');
const res = require('express/lib/response');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ABCRecycling'
});

//connection
db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('MySQL Connected!');
});

const app = express();

//create db
app.get('/createdb', (req, res) => {
    let sql = 'CREAE DATABASE ABCRecycling';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Database created...');
    })
}) 

//create cars
app.get('/createCar', () => {
    let sql = 'CREATE TABLE Car (carId int NOT NULL, registrationNumber varchar(20) NOT NULL, overviewDate date NOT NULL, CONSTRAINT Car_pk PRIMARY KEY (carId))';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Cars created...');
    })
})

//insert example
app.get('/addCar', (req, res) => {
    let car1 = {carId: 1, registrationNumber: 'WL19283'};
    let sql = 'INSERT INTO Car SET ?';
    let query = db.query(sql, car1, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Cars created...');
    })
})

//select example
app.get('/getCars/:id', (req, res) => {
    let sql = `SELECT * FROM Cars WHERE carId = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send('Car fetched...');
    })
})

//update example
app.get('/updateCar/:id', (req, res) => {
    let newId = 'WL1099';
    let sql = `UPDATE Cars SET registrationNumber = '${newId}' WHERE carId = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send('Car updated...');
    })
})

//delete example
app.get('/deleteCar/:id', (req, res) => {
    let sql = `DELETE FROM Cars WHERE carId = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send('Car deleted...');
    })
})


//address
app.get('/createAddress', () => {
  let sql = 'CREATE TABLE Address (addressId int NOT NULL, street varchar(30) NOT NULL, houseNumber int NOT NULL, flatNumber varchar(10) NULL, ZIPcode varchar(10)  NOT NULL, cityId int  NOT NULL, CONSTRAINT Address_pk PRIMARY KEY (addressId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Address created...');
  })
})

app.get('/addAddress', (req, res) => {
  let address1 = {addressId: 1, street: 'Polna', houseNumber: 12, ZIPcode: '05-168', cityId: 1};
  let sql = 'INSERT INTO Address SET ?';
  let query = db.query(sql, address1, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Address created...');
  })
})

app.get('/getAddress/:id', (req, res) => {
  let sql = `SELECT * FROM Address WHERE addressId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Address fetched...');
  })
})

app.get('/updateAddress/:id', (req, res) => {
  let newId = 'Updated';
  let sql = `UPDATE Address SET street = '${newId}' where addressId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Address updated...');
  })
})

app.get('/deleteAddress/:id', (req, res) => {
  let sql = `DELETE FROM Address WHERE addressId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Address deleted...');
  })
})


//carTransport
app.get('/createCarTransport', () => {
  let sql = 'CREATE TABLE CarTransport (carId int  NOT NULL, transportId int  NOT NULL, workerId int  NOT NULL, CONSTRAINT CarTransport_pk PRIMARY KEY (carId,transportId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('CarTransport created...');
  })
})


//City
app.get('/createCity', () => {
  let sql = 'CREATE TABLE City (cityId int  NOT NULL, name varchar(30) NOT NULL, CONSTRAINT City_pk PRIMARY KEY (cityId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('City created...');
  })
})

app.get('/addCity', (req, res) => {
  let city1 = {cityId: 1, name: 'Warszawa'};
  let sql = 'INSERT INTO City SET ?';
  let query = db.query(sql, city1, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('City created...');
  })
})

app.get('/getCity/:id', (req, res) => {
  let sql = `SELECT * FROM City WHERE cityId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('City fetched...');
  })
})

app.get('/updateCity/:id', (req, res) => {
  let newId = 'Updated';
  let sql = `UPDATE City SET name = '${newId}' where cityId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('City updated...');
  })
})

app.get('/deleteCity/:id', (req, res) => {
  let sql = `DELETE FROM City WHERE cityId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('City deleted...');
  })
})

//Company
app.get('/createCompany', () => {
  let sql = 'CREATE TABLE Company (companyId int  NOT NULL, NIP varchar(30)  NOT NULL, bankAccountNumber varchar(30) NULL, CONSTRAINT Company_pk PRIMARY KEY (companyId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Company created...');
  })
})

app.get('/addCompany', (req, res) => {
  let company1 = {cityId: 1, NIP: '892034890', bankAccountNumber: '8198302918366013'};
  let sql = 'INSERT INTO Company SET ?';
  let query = db.query(sql, company1, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Company created...');
  })
})

app.get('/getCompany/:id', (req, res) => {
  let sql = `SELECT * FROM Company WHERE companyId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Company fetched...');
  })
})

app.get('/updateCompany/:id', (req, res) => {
  let newId = '8921038091';
  let sql = `UPDATE Company SET NIP = '${newId}' where companyId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Company updated...');
  })
})

app.get('/deleteCompany/:id', (req, res) => {
  let sql = `DELETE FROM Company WHERE companyId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Company deleted...');
  })
})

//Contractor
app.get('/createContractor', () => {
  let sql = 'CREATE TABLE Contractor (contractorId int  NOT NULL, CONSTRAINT Contractor_pk PRIMARY KEY (contractorId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Contractor created...');
  })
})

app.get('/addContractor', (req, res) => {
  let contracor1 = {contractorId: 1};
  let sql = 'INSERT INTO Contractor SET ?';
  let query = db.query(sql, contracor1, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Contractor created...');
  })
})

app.get('/getContractor/:id', (req, res) => {
  let sql = `SELECT * FROM Contractor WHERE companyId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Contractor fetched...');
  })
})

app.get('/updateContractor/:id', (req, res) => {
  let newId = 2;
  let sql = `UPDATE Company SET contractorId = '${newId}' where contractorId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Contractor updated...');
  })
})

app.get('/deleteContractor/:id', (req, res) => {
  let sql = `DELETE FROM Contractor WHERE contractorId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Contractor deleted...');
  })
})

//Customer
app.get('/createCustomer', () => {
  let sql = 'CREATE TABLE Customer (customerId int  NOT NULL,name varchar(50)  NOT NULL,surname varchar(50) NOT NULL, IDnumber varchar(50) NULL, CONSTRAINT Customer_pk PRIMARY KEY (customerId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Customer created...');
  })
})

app.get('/addCustomer', (req, res) => {
  let customer1 = {customerId: 2, name: 'Jan', surname: 'Nowak', IDnumber: 'CD23890'};
  let sql = 'INSERT INTO Customer SET ?';
  let query = db.query(sql, customer1, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Customer created...');
  })
})

app.get('/getCustomer/:id', (req, res) => {
  let sql = `SELECT * FROM Customer WHERE customerId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Customer fetched...');
  })
})

app.get('/updateCustomer/:id', (req, res) => {
  let newId = 2;
  let sql = `UPDATE Customer SET customerId = '${newId}' where customerId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Customer updated...');
  })
})

app.get('/deleteCustomer/:id', (req, res) => {
  let sql = `DELETE FROM Customer WHERE customerId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Customer deleted...');
  })
})

//Invoice
app.get('/createInvoice', () => {
  let sql = 'CREATE TABLE Invoice (invoiceId int NOT NULL, invoiceDate date NOT NULL, CONSTRAINT Invoice_pk PRIMARY KEY (invoiceId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Invoice created...');
  })
})

app.get('/addInvoice', (req, res) => {
  let d = new Date("October 13, 2022 11:30:00"); //check
  let invoice1 = {invoiceId: 1, invoiceDate: d};
  let sql = 'INSERT INTO Invoice SET ?';
  let query = db.query(sql, invoice1, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Invoice created...');
  })
})

app.get('/getInvoice/:id', (req, res) => {
  let sql = `SELECT * FROM Invoice WHERE invoiceId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Invoice fetched...');
  })
})

app.get('/updateInvoice/:id', (req, res) => {
  let newId = 2;
  let sql = `UPDATE Invoice SET invoiceId = '${newId}' where invoiceId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Invoice updated...');
  })
})

app.get('/deleteInvoice/:id', (req, res) => {
  let sql = `DELETE FROM Invoice WHERE invoiceId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Invoice deleted...');
  })
})


//Purchase
app.get('/createPurchase', () => {
  let sql = 'CREATE TABLE Purchase (contractorId int NOT NULL, stockId int NOT NULL, price money NOT NULL, transportId int  NOT NULL, CONSTRAINT Purchase_pk PRIMARY KEY (contractorId,stockId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Purchase created...');
  })
})


//Sale
app.get('/createSale', () => {
  let sql = 'CREATE TABLE Sale (saleId int NOT NULL, price money NOT NULL, commodityId int  NOT NULL, isPaid boolean NOT NULL, statusId int NOT NULL, invoiceId int  NOT NULL, companyId int NOT NULL, transportId int NOT NULL, CONSTRAINT Sale_pk PRIMARY KEY (saleId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Sale created...');
  })
})

app.get('/addSale', (req, res) => {
  let sale1 = {saleId: 1, price: 50.0, commodityId: 1, isPaid: true, statusId: 2, invoiceId: 1, companyId: 1, transportId: 1};
  let sql = 'INSERT INTO Sale SET ?';
  let query = db.query(sql, sale1, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Sale created...');
  })
})

app.get('/getSale/:id', (req, res) => {
  let sql = `SELECT * FROM Sale WHERE saleId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Sale fetched...');
  })
})

app.get('/updateSale/:id', (req, res) => {
  let newId = 2;
  let sql = `UPDATE Sale SET saleId = '${newId}' where saleId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Sale updated...');
  })
})

app.get('/deleteSale/:id', (req, res) => {
  let sql = `DELETE FROM Sale WHERE saleId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Sale deleted...');
  })
})

//Status
app.get('/createStatus', () => {
  let sql = 'CREATE TABLE Status (statusId int NOT NULL, name varchar(50) NOT NULL, emailTemplate varchar(500)  NOT NULL, CONSTRAINT Status_pk PRIMARY KEY (statusId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Status created...');
  })
})

app.get('/addStatus', (req, res) => {
  let status1 = {statusId: 1, name: 'W rejestracji', emailTemplate: 'status w rejestacji'};
  let sql = 'INSERT INTO Status SET ?';
  let query = db.query(sql, status1, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Status created...');
  })
})

app.get('/getStatus/:id', (req, res) => {
  let sql = `SELECT * FROM Status WHERE statusId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Status fetched...');
  })
})

app.get('/updateStatus/:id', (req, res) => {
  let newId = 2;
  let sql = `UPDATE Status SET statusId = '${newId}' where statusId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Status updated...');
  })
})

app.get('/deleteStatus/:id', (req, res) => {
  let sql = `DELETE FROM Status WHERE statusId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Status deleted...');
  })
})


//Stock
app.get('/createStock', () => {
  let sql = 'CREATE TABLE Stock (stockId int NOT NULL, weight int  NOT NULL, typeId int NOT NULL, CONSTRAINT Stock_pk PRIMARY KEY (stockId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Stock created...');
  })
})

app.get('/addStock', (req, res) => {
  let stock1 = {stockId: 1, weight: 3, typeId: 2};
  let sql = 'INSERT INTO Stock SET ?';
  let query = db.query(sql, stock1, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Stock created...');
  })
})

app.get('/getStock/:id', (req, res) => {
  let sql = `SELECT * FROM Stock WHERE stockId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Stock fetched...');
  })
})

app.get('/updateStock/:id', (req, res) => {
  let newId = 2;
  let sql = `UPDATE Stock SET stockId = '${newId}' where stockId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Stock updated...');
  })
})

app.get('/deleteStock/:id', (req, res) => {
  let sql = `DELETE FROM Stock WHERE stockId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Stock deleted...');
  })
})


//Transport
app.get('/createTransport', () => {
  let sql = 'CREATE TABLE Transport (transportId int  NOT NULL, phone varchar(20)  NOT NULL, addressId int  NOT NULL, CONSTRAINT Transport_pk PRIMARY KEY (transportId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Transport created...');
  })
})

app.get('/addTransport', (req, res) => {
  let transport1 = {transportId: 1, phone: '909888777', addressId: 1};
  let sql = 'INSERT INTO Stock SET ?';
  let query = db.query(sql, transport1, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Transport created...');
  })
})

app.get('/getTransport/:id', (req, res) => {
  let sql = `SELECT * FROM Transport WHERE transportId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Transport fetched...');
  })
})

app.get('/updateTransport/:id', (req, res) => {
  let newId = 2;
  let sql = `UPDATE Transport SET transportId = '${newId}' where transportId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Transport updated...');
  })
})

app.get('/deleteTransport/:id', (req, res) => {
  let sql = `DELETE FROM Transport WHERE transportId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Transport deleted...');
  })
})


//TypeOfProduct
app.get('/createTypeOfProduct', () => {
  let sql = 'CREATE TABLE TypeOfProduct (typeId int  NOT NULL, name varchar(30)  NOT NULL, productCode varchar(30)  NOT NULL, CONSTRAINT TypeOfProduct_pk PRIMARY KEY (typeId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('TypeOfProduct created...');
  })
})

app.get('/addTypeOfProduct', (req, res) => {
  let type1 = {typeId: 1, name: 'polietylen', productCode: '89080989'};
  let sql = 'INSERT INTO Stock SET ?';
  let query = db.query(sql, type1, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('TypeOfProduct created...');
  })
})

app.get('/getTypeOfProduct/:id', (req, res) => {
  let sql = `SELECT * FROM TypeOfProduct WHERE typeId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('TypeOfProduct fetched...');
  })
})

app.get('/updateTypeOfProduct/:id', (req, res) => {
  let newId = 2;
  let sql = `UPDATE TypeOfProduct SET typeId = '${newId}' where typeId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('TypeOfProduct updated...');
  })
})

app.get('/deleteTypeOfProduct/:id', (req, res) => {
  let sql = `DELETE FROM TypeOfProduct WHERE typeId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('TypeOfProduct deleted...');
  })
})


//Worker
app.get('/createWorker', () => {
  let sql = 'CREATE TABLE Worker (workerId int  NOT NULL, name varchar(50)  NOT NULL, surname varchar(50)  NOT NULL, IDnumber varchar(50)  NOT NULL, CONSTRAINT Worker_pk PRIMARY KEY (workerId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Worker created...');
  })
})

app.get('/addWorker', (req, res) => {
  let worker1 = {workerId: 3, name: 'Emilia', surname: 'Banan', IDnumber: 'CD78979'};
  let sql = 'INSERT INTO Stock SET ?';
  let query = db.query(sql, worker1, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Worker created...');
  })
})

app.get('/getWorker/:id', (req, res) => {
  let sql = `SELECT * FROM Worker WHERE workerId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Worker fetched...');
  })
})

app.get('/updateWorker/:id', (req, res) => {
  let newId = 2;
  let sql = `UPDATE Worker SET workerId = '${newId}' where workerId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Worker updated...');
  })
})

app.get('/deleteWorker/:id', (req, res) => {
  let sql = `DELETE FROM Worker WHERE typeId = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Worker deleted...');
  })
})


//stockStatus
app.get('/createstockStatus', () => {
  let sql = 'CREATE TABLE stockStatus (typeId int  NOT NULL, weight bigint  NOT NULL, updateDate date  NOT NULL, CONSTRAINT stockStatus_pk PRIMARY KEY (typeId))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('stockStatus created...');
  })
})

app.listen('3306', () => {
    console.log('Server started on port 3306');
});


