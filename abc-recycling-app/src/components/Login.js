import React, { useEffect, useState } from "react";
import Axios from "../request";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;

  const login = () => {
    Axios.post("/login", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        navigate("/");
        setLoginStatus("Zalogowany");
      }
    });
  };

  useEffect(() => {
    Axios.get("/login").then((response) => {
      if (response.data.loggedIn == true) {
        setLoginStatus("Zalogowany");
      }
    });
  }, []);

  return (
    <div className="main">
      <div className="login">
        <h1>Zaloguj się</h1>
        <input
          type="text"
          placeholder="Login..."
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Hasło..."
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button className="btn" onClick={login} style={{padding: '10px', }}> Zaloguj </button>
      </div>
      <h2>{loginStatus}</h2>
    </div>
  );
}

export default Login