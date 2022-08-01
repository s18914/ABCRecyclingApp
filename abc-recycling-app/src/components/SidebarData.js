import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as FiIcons from 'react-icons/fi';

export const SidebarData = [
  {
    title: 'Strona główna',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Transport',
    path: '/transports',
    icon: <FaIcons.FaTruck />,
    cName: 'nav-text',
    subNav: [
      {    
        title: 'Adresy',
        path: '/addresses',
        icon: <FaIcons.FaBuilding />,
      },
      {    
        title: 'Ciężarówki',
        path: '/cars',
        icon: <FaIcons.FaCar />,
      }
    ]
  },
  {
    title: 'Sprzedaż',
    path: '/sales',
    icon: <AiIcons.AiFillShopping />,
    cName: 'nav-text'
  },
  {
    title: 'Magazyn',
    path: '/stock',
    icon: <FiIcons.FiPackage />,
    cName: 'nav-text'
  },
  {
    title: 'Klienci',
    path: '/customers',
    icon: <AiIcons.AiOutlineUser />,
    cName: 'nav-text'
  },
  {
    title: 'Kupno',
    path: '/purchases',
    icon: <FaIcons.FaShoppingBasket />,
    cName: 'nav-text'
  },
  {
    title: 'Pracownicy',
    path: '/workers',
    icon: <AiIcons.AiOutlineUser />,
    cName: 'nav-text'
  }
];