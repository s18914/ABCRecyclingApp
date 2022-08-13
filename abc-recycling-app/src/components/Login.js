import React, { useEffect, useState } from "react";
import Axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  Axios.defaults.withCredentials = true;

  const login = () => {
    console.log(username)
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    }).then((response) => {
      console.log(response)
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        setLoginStatus(response.data.rows[0].username);
      }
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn == true) {
        console.log("zalogowany")
        console.log(response)
        setLoginStatus(response.data.user.rows[0].username);
      }
      console.log(response)
    });
  }, []);

  return (
    <div className="main">
      <div className="login">
        <h1>Zaloguj się</h1>
        <input
          type="text"
          placeholder="Username..."
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password..."
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button className="btn" onClick={login} style={{padding: '10px', }}> Zaloguj </button>
      </div>
      Zalogowany jako:<h2>{loginStatus}</h2>
    </div>
  );
}

export default Login