import { useState, useEffect} from "react";
import Axios from "axios";
import { FaCheckCircle, FaBuilding, FaUserAlt } from 'react-icons/fa'
import { useParams } from "react-router-dom";

function PurchaseAdd() {
  
  let { id } = useParams();
  let isAddMode = ({id}.id === undefined ? true : false);

  return (
    <div></div>
  )
}

export default PurchaseAdd