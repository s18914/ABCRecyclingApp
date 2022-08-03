import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as RiIcons from 'react-icons/ri';
import * as FiIcons from 'react-icons/fi';

export const SidebarData = [
  {
    title: 'Strona główna',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Transporty',
    path: '',
    icon: <FaIcons.FaTruck />,
    cName: 'nav-text',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {    
        title: 'Lista transportów',
        path: '/transports',
      },
      {    
        title: 'Adresy',
        path: '/addresses',
      },
      {    
        title: 'Ciężarówki',
        path: '/cars',
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