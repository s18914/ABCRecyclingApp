const express = require("express");
const app = express();
const pg = require("pg");
const cors = require("cors");
require('dotenv').config();

app.use(cors());
app.use(express.json());


const { Client } = require('pg')

const client = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
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

app.put("/transportUpdate", (req, res) => {
  const id = req.body.id;
  const date = req.body.date;
  const phone = req.body.phone;
  const address = req.body.address;
  const car = req.body.car;
  const worker = req.body.worker;

  client.query(
    "Update transports set date = $1, phone = $2, address_id = $3, car_id = $4, worker_id = $5 where transport_id = $6",
    [id, date, phone, address, car, worker],
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

app.get("/TransportsLookup", (req, res) => {
  client.query("SELECT * from get_transports_4_lookup()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

//Car
app.post("/carCreate", (req, res) => {
  const registrationNumber = req.body.registrationNumber;
  const overviewDate = req.body.overviewDate;

  client.query(
    "INSERT INTO cars (registration_number, overview_date) VALUES ($1,$2)",
    [registrationNumber, overviewDate],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json({value:"siema"});
      }
    }
  );
});

app.get("/car/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT * FROM cars WHERE car_id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows[0]);
    }
  });
});

app.get("/cars", (req, res) => {
  client.query("SELECT car_id, registration_number, to_char(overview_date, 'YYYY-MM-DD') overview_date FROM cars", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

app.put("/carUpdate", (req, res) => {
  const id = req.body.id;
  const registrationNumber = req.body.registrationNumber;
  const overviewDate = req.body.overviewDate;

  client.query(
    "Update cars set registration_number = $1, overview_date = $2 where car_id = $3",
    [registrationNumber, overviewDate, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/carDelete/:id", (req, res) => {
  const id = req.params.id;
  client.query("DELETE FROM cars WHERE car_id = $1", 
  [id], 
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/CarsLookup", (req, res) => {
  client.query("SELECT * from get_cars_4_lookup()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

//Address
// app.get("/addresses", (req, res) => {
//   client.query("SELECT street, house_number, flat_number FROM addresses", (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json(result.rows);
//       return;
//     }
//   });
// });

app.post("/addressCreate", (req, res) => {
  const street = req.body.street;
  const houseNumber = req.body.houseNumber;
  const flatNumber = req.body.flatNumber;

  client.query(
    "INSERT INTO cars (street, houseNumber, flatNumber) VALUES ($1,$2, $3)",
    [street, houseNumber, flatNumber],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result.rows);
        return;
      }
    }
  );
});

//ZIPCode
app.get("/zipCodesForLookup", (req, res) => {
  client.query("SELECT zip_code as label, zip_code_id as id FROM zip_codes", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

app.get("/zipCodes", (req, res) => {
  client.query("SELECT zip_code, province, city FROM zip_codes", (err, result) => {
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
  client.query("SELECT c.*, cu.*, co.* FROM contractors c left join customers cu on cu.contractor_id = c.contractor_id left join companies co on co.contractor_id = c.contractor_id where c.contractor_id = $1", [id], (err, result) => {
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
  const name = req.body.name;
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

app.put("/companyUpdate", (req, res) => {
  const name = req.body.name;
  const nip = req.body.nip;
  const account_number = req.body.account_number;
  const email = req.body.email;
  const id = req.body.id;

  client.query(
    "Update companies set name = $1, nip = $2, account_number = $3, email = $4 where contractor_id = $5",
    [name, nip, account_number, email, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/CompaniesLookup", (req, res) => {
  client.query("SELECT name as label, contractor_id as id FROM companies", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
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


//Document
app.get("/documentInit", (req, res) => {
  client.query("select init_document(null)", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

app.put("/documentUpdate", (req, res) => {
  const document_id = req.body.document_id;
  const contractor_Id = req.body.contractor_Id;
  let transport_Id = req.body.transport_Id;
  if(transport_Id === undefined) transport_Id = null;

  client.query(
    "Update purchases set contractor_Id = $1, transport_Id = $2 where document_id = $3",
    [contractor_Id, transport_Id, document_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//Sale
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

app.put("/saleUpdateStatus", (req, res) => {
  const id = req.body.id;
  const status_id = req.body.status_id;
  if(status_id >= 0 && status_id <=3 ) {
    client.query("update sales set status_id = $2 WHERE document_id = $1", [id, status_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result.rows[0]);
      }
    });
  }
});

app.put("/SaleUpdatePayment", (req, res) => {
  const id = req.body.id;
  const val = req.body.val;

  if(val) {
    client.query("update sales set is_paid = 'true' WHERE document_id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows[0]);
    }
    });
  } else {
    client.query("update sales set is_paid = 'false' WHERE document_id = $1", [id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result.rows[0]);
      }
      });
  }
  
});

//Worker
app.post("/workerCreate", (req, res) => {
  const worker_id = req.body.worker_id;
  const name = req.body.name;
  const surname = req.body.surname;
  const id_number = req.body.id_number;
  const role_id = req.body.role_id;

  client.query(
    "INSERT INTO workers (worker_name, surname, id_number, role_id) VALUES ($1,$2,$3)",
    [name, surname, id_number, role_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/workers", (req, res) => {
  client.query("SELECT * FROM get_workers()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});
    
app.get("/worker/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT * FROM workers WHERE worker_id = $1", 
  [id],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows[0]);
    }
  });
});

app.put("/workerUpdate", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const surname = req.body.surname;
  const id_number = req.body.id_number;

  client.query(
    "Update workers set name = $1, surname = $2, id_number = $3 where worker_id = $4",
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

app.delete("/workerDelete/:id", (req, res) => {
  const id = req.params.id;
  client.query("DELETE FROM workers WHERE worker_id = $1", 
  [id], 
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/WorkersLookup", (req, res) => {
  client.query("SELECT * from get_workers_4_lookup()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

//WorkerRole

app.get("/roles", (req, res) => {
  client.query("SELECT name as label, role_id as id FROM roles", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

//Product
app.get("/documentProducts/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT * from get_document_products($1)", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
    }
  });
});

app.put("/productUpdate", (req, res) => {
  const document_id = req.body.document_id;
  const type_id = req.body.type_id;
  const price = req.body.price;
  const weight = req.body.weight;

  client.query(
    "call create_or_update_product($1, $2, $3, $4);",
    [document_id, type_id, price, weight],
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