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

//Car
app.post("/carCreate", (req, res) => {
  const registrationNumber = req.body.registrationNumber;
  const overviewDate = req.body.overviewDate;

  client.query(
    "INSERT INTO transports (registrationNumber, overviewDate) VALUES ($1,$2)",
    [date, phone],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json({value:"siema"});
      }
    }
  );
});

app.get("/cars", (req, res) => {
  client.query("SELECT * FROM cars", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});


//Klient
app.get("/customers", (req, res) => {
  client.query("SELECT c.contractor_id as id, *, c.name, CASE WHEN f.nip is not null then 'C' else 'P' END AS type FROM contractors c left join companies f on c.contractor_id= f.contractor_id left join customers k on c.contractor_id= k.contractor_id", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

app.get("/customer/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT * FROM customers WHERE contractor_id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows[0]);
    }
  });
});

app.post("/customerCreate", (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const id_number = req.body.id_number;

  client.query(
    "INSERT INTO customers (name, surname, id_number) VALUES ($1,$2,$3)",
    [name, surname, id_number],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/customerUpdate", (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const id_number = req.body.id_number;
  const id = req.body.id;

  client.query(
    "Update customers set name = $1, surname = $2, id_number = $3 where contractor_id = $4",
    [name, surname, id_number, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/customerDelete/:id", (req, res) => {
  const id = req.params.id;
  client.query("DELETE FROM contractors WHERE contractor_id = $1", 
  [id], 
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//company
app.post("/companyCreate", (req, res) => {
  const nip = req.body.nip;
  const account_number = req.body.account_number;
  const email = req.body.email;
 
  client.query(
    "INSERT INTO companies (nip, account_number, email) VALUES ($1,$2,$3)",
    [nip, account_number, email],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.listen(3001, () => {
  console.log("Your server is running on port 3001");
});

//Purchase
app.get("/purchases", (req, res) => {
  client.query("SELECT * from get_purchases()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

//Sales
app.get("/sales", (req, res) => {
  client.query("SELECT * from get_sales()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});