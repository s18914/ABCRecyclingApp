const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "recyclingSystem",
});

app.post("/transportCreate", (req, res) => {
  const date = req.body.date;
  const phone = req.body.phone;
  const address = req.body.address;

  db.query(
    "INSERT INTO transports (date, phone, address) VALUES (?,?,?)",
    [date, phone, address],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.get("/transports", (req, res) => {
  db.query("SELECT * FROM transports", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/transportUpdate", (req, res) => {
  const id = req.body.id;
  const wage = req.body.wage;
  db.query(
    "UPDATE transports SET phone = ? WHERE id = ?",
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

app.delete("/transportDelete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM transports WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});