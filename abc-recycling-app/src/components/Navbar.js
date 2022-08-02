import React, { useState } from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from 'react-icons/ai';
import {Link} from 'react-router-dom';
import { SidebarData } from './SidebarData';
import '../css/style.css';
import { IconContext } from 'react-icons';
import Logo from'../logo.png';
import SubMenu from './SubMenu';

function Navbar() {

    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);

    return (
        <>
          <IconContext.Provider value={{ color: '#fff' }}>
            <div className='header'>
              <Link to='#' className='menu-bars'>
                <FaIcons.FaBars onClick={showSidebar} />
              </Link>
            <img  src={Logo} alt="abc-recycling"/>
            </div>
            <nav  sidebar={sidebar} className={sidebar ? 'nav-menu active' : 'nav-menu'}>
              <ul className='nav-menu-items'>
                <li className='navbar-toggle'>
                  <Link to='#' className='menu-bars'>
                    <AiIcons.AiOutlineClose onClick={showSidebar}/>
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