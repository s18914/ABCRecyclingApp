const express = require("express");
const app = express();
const pg = require("pg");
const cors = require("cors");

app.use(cors());
app.use(express.json());


const { Client } = require('pg')

const client = new Client({
  user: '35952342_4321',
  host: 'serwer2293331.home.pl',
  database: '35952342_4321',
  password: 'Adminadmin123}',
  port: 5432,
});

client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


//Transport
app.post("/transportCreate", (req, res) => {
  const date = req.body.date;
  const phone = req.body.phone;
  const address = req.body.address;

  client.query(
    "INSERT INTO transports (date, phone, address) VALUES ($1,$2,$3)",
    [date, phone, address],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json({value:"siema"});
      }
    }
  );
});

app.get("/transports", (req, res) => {
  client.query("SELECT * FROM transports", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

app.get("/transport/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT * FROM transports WHERE transport_id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows[0]);
    }
  });
});

app.put("/transportEditPhone", (req, res) => {
  const id = req.body.id;
  const phone = req.body.phone;
  console.log(id);
  client.query(
    "UPDATE transports SET phone = $1 WHERE transport_id = $2",
    [phone, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/transportEditAddress", (req, res) => {
  const id = req.body.id;
  const address = req.body.address;
  client.query(
    "UPDATE transports SET address = $1 WHERE transport_id = $2",
    [address, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/transportEditDate", (req, res) => {
  const id = req.body.id;
  const date = req.body.date;
  client.query(
    "UPDATE transports SET date = $1 WHERE transport_id = $2",
    [date, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/transportDelete/:id", (req, res) => {
  const id = req.params.id;
  client.query("DELETE FROM transports WHERE transport_id = $1", 
  [id], 
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Klient
app.get("/customers", (req, res) => {
  client.query("SELECT * FROM customers", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

app.delete("/customerDelete/:id", (req, res) => {
  const id = req.params.id;
  client.query("DELETE FROM customers WHERE customer_id = $1", 
  [id], 
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
  console.log("Your server is running on port 3001");
});