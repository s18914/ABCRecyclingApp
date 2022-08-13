import React, { useEffect, useState } from 'react';
import Axios from "axios";
import * as FaIcons from "react-icons/fa";

import {AiOutlineLogin, AiOutlineClose} from "react-icons/ai";
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import '../css/style.css';
import { IconContext } from 'react-icons';
import Logo from'../logo.png';
import SubMenu from './SubMenu';
import { useNavigate } from "react-router-dom";

function Navbar() {

  const [sidebar, setSidebar] = useState(false);
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;
  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn == true) {
        setRole(response.data.user.rows[0].role_id);
      }
    });
  });


    const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='header'>
          {role === "" ? 
          <>
            <AiOutlineLogin style={{transform: 'scale(3.0)', color: 'white', cursor: 'pointer', padding: '0 85px'}} onClick={() => {navigate("/login")}}/>
            <Link to='#' className='menu-bars'>
              <FaIcons.FaBars  />
            </Link>
          </> : 
            <Link to='#' className='menu-bars'>
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
          }
          <img src={Logo} alt="abc-recycling" />
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiOutlineClose />
              </Link>
            <img  src={Logo} alt="abc-recycling"/>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
              <ul className='nav-menu-items' onClick={showSidebar}>
                <li className='navbar-toggle'>
                  <Link to='#' className='menu-bars'>
                    <AiIcons.AiOutlineClose />
                  </Link>
                </li>
                {SidebarData.map((item, index) => {
                  return <SubMenu item={item} key={index} />;
                })}
              </ul>
            </nav>
          </IconContext.Provider>
        </>
    );
}

export default Navbar