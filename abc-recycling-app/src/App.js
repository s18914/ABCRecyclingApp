import Header from './components/Header'
import Navbar from './components/Navbar'
 import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
// import Home from './pages/Home';
// import Reports from './pages/r';
// import Products from './pages/pr';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          {/* <Route path='/' exact element={<Home/>} />
          <Route path='/reports' component={p} />
          <Route path='/products' component={pr} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
