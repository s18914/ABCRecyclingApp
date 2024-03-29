import React from 'react';
import Navbar from './components/Navbar'
import Login from './components/Login';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Transports from './components/pages/Transports';
import TransportAdd from './components/pages/TransportAdd';
import Sales from './components/pages/Sales';
import SaleAdd from './components/pages/SaleAdd';
import Customers from './components/pages/Customers';
import CustomerAdd from './components/pages/CustomerAdd';
import Purchases from './components/pages/Purchases';
import Workers from './components/pages/Workers';
import WorkerAdd from './components/pages/WorkerAdd';
import PurchaseAdd from './components/pages/PurchaseAdd';
import Products from './components/pages/Products';
import ProductAdd from './components/pages/ProductAdd';
import Cars from './components/pages/Cars';
import CarAdd from './components/pages/CarAdd';
import Types from './components/pages/WorkerAdd';
import Stock from './components/pages/Stock';
import Addresses from './components/pages/Addresses';
import AddressAdd from './components/pages/AddressAdd';


const App = () => {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/login' exact element={<Login/>} />
          <Route path='/' exact element={<Home/>} />
          <Route path='/transports'exact element={<Transports/>} />
          <Route path='/transports/add'exact element={<TransportAdd/>} />
          <Route path='/transports/edit/:id'exact element={<TransportAdd/>} />
          <Route path='/transportDelete/:id'exact element={<Transports/>} />
          <Route path='/sales' exact element={<Sales/>} />
          <Route path='/sales/add' exact element={<SaleAdd/>} />
          <Route path='/sales/edit/:id' exact element={<SaleAdd/>} />
          <Route path='/customers' exact element={<Customers/>} />
          <Route path='/customers/add' exact element={<CustomerAdd/>} />
          <Route path='/customers/edit/:id' exact element={<CustomerAdd/>} />
          <Route path='/purchases' exact element={<Purchases/>} />
          <Route path='/workers' exact element={<Workers/>} />
          <Route path='/workers/add' exact element={<WorkerAdd/>} />
          <Route path='/workers/edit/:id' exact element={<WorkerAdd/>} />
          <Route path='/purchases/add' exact element={<PurchaseAdd/>} />
          <Route path='/purchases/edit/:id' exact element={<PurchaseAdd/>} />
          <Route path='/products' exact element={<Products/>} />
          <Route path='/product/add' exact element={<ProductAdd/>} />
          <Route path='/cars' exact element={<Cars/>} />
          <Route path='/cars/add' exact element={<CarAdd/>} />
          <Route path='/cars/edit/:id' exact element={<CarAdd/>} />
          <Route path='/workers/add' exact element={<Types/>} />
          <Route path='/stock' exact element={<Stock/>} />
          <Route path='/addresses' exact element={<Addresses/>} />
          <Route path='/address/add' exact element={<AddressAdd/>} />
          <Route path='/address/edit/:id' exact element={<AddressAdd/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;