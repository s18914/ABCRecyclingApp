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
