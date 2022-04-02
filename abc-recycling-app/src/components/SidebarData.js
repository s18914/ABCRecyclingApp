import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as FiIcons from 'react-icons/fi';

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Transport',
    path: '/transports',
    icon: <FaIcons.FaTruck />,
    cName: 'nav-text'
  },
  {
    title: 'Sprzedaż',
    path: '/sales',
    icon: <AiIcons.AiFillShopping />,
    cName: 'nav-text'
  },
  {
    title: 'Magazyn',
    path: '/stocks',
    icon: <FiIcons.FiPackage />,
    cName: 'nav-text'
  },
  {
    title: 'Firmy',
    path: '/companies',
    icon: <FaIcons.FaBuilding />,
    cName: 'nav-text'
  },
  {
    title: 'Klienci indywidualni',
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
    title: 'Dokumenty',
    path: '/invoices',
    icon: <FaIcons.FaFileAlt />,
    cName: 'nav-text'
  }
];