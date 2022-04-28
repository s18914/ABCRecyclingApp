import React, { useState } from 'react';
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Transports from './components/pages/Transports';
import TransportAdd from './components/pages/TransportAdd';
import TransportEdit from './components/pages/TransportEdit';
import TransportDetails from './components/pages/TransportDetails';
//import Sales from './pages/Sales';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' exact element={<Home/>} />
          <Route path='/transports'exact element={<Transports/>} />
          <Route path='/transports/add'exact element={<TransportAdd/>} />
          <Route path='/transports/edit'exact element={<TransportEdit/>} />
          <Route path='/transports/details'exact element={<TransportDetails/>} />
          <Route path='/transportDelete/:id'exact element={<Transports/>} />
          {/* <Route path='/sales' component={<Sales/>} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;