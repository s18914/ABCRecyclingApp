const express = require("express");
const app = express();
const pg = require("pg");
const cors = require("cors");
require('dotenv').config();

const path = require("path");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require('cookie-session');
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  domain: process.env.DOMAIN,
}));
app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const sameSite = process.env.SAME_SITE || "none";

app.use(
  session({
    secret: "subscribe",
    maxAge: 1000 * 60 * 60,
    sameSite,
    secure: sameSite === "none" ,
    httpOnly: false
  })
);

const { Client } = require('pg');
let client;

function connect() {
  client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
  });

  client.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });

  client.on("error", (error, client) => {
    console.log("błąd: " + error);
    setTimeout(connect, 1000);
  })
}

connect();
app.use(express.static(
  path.join(__dirname,"../abc-recycling-app/build")));

//Login
app.get("/api/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // bcrypt.hash(password, saltRounds, (err, hash) => {
  //   console.log(hash);
  // });

  client.query(
    "SELECT * FROM workers WHERE username = $1;",
    [username],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.rowCount > 0) {

        bcrypt.compare(password, result.rows[0].password, (error, response) => {
          if (response) {
            req.session.user = result;
            res.send(result);
          } else {
            res.send({ message: "Zły login lub hasło." });
          }
        });
      } else {
        res.send({ message: "Dane nie są poprawne." });
      }
    }
  );
});

//Transport
app.post("/api/transportCreate", (req, res) => {
  const date = req.body.date;
  const phone = req.body.phone;
  const address_id = req.body.address_id;
  const car_id = req.body.car_id;
  const worker_id = req.body.worker_id;

  client.query(
    "INSERT INTO transports (date, phone, address_id, car_id, worker_id) VALUES ($1,$2,$3,$4,$5)",
    [date, phone, address_id, car_id, worker_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result.rows);
      }
    }
  );
});

app.get("/api/transports", (req, res) => {
  client.query("SELECT t.transport_id, to_char(t.date, 'yyyy-mm-dd') as transport_date, t.phone, c.registration_number, concat(a.street, ' ', a.house_number, ' ', a.flat_number, ', ', z.zip_code, ' ', z.city) as transport_address, concat(w.name, ' ', w.surname) as transport_worker, case when t.transport_id in (select transport_id FROM sales union select transport_id FROM purchases) then '0' else '1' END AS can_delete FROM public.transports t inner join public.addresses a on a.address_id = t.address_id inner join public.zip_codes z on z.zip_code_id = a.zip_code_id inner join public.workers w on w.worker_id = t.worker_id inner join public.cars c on c.car_id = t.car_id;", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

app.get("/api/transport/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT address_id, date, phone, car_id, worker_id FROM transports WHERE transport_id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows[0]);
    }
  });
});

app.get("/api/lastTransport", (req, res) => {
  client.query("SELECT label, id from get_transports_4_lookup() order by id desc LIMIT 1",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result.rows[0]);
      }
    });
});

app.get("/api/getTransportVal/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT label, id from get_transports_4_lookup() WHERE id = $1", [id],  
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows[0]);
    }
  });
});

app.put("/api/transportUpdate", (req, res) => {
  const id = req.body.id;
  const date = req.body.date;
  const phone = req.body.phone;
  const address_id = req.body.address_id;
  const car_id = req.body.car_id;
  const worker_id = req.body.worker_id;

  client.query(
    "Update transports set address_id = $1, date = $2, phone = $3, car_id = $4, worker_id = $5 where transport_id = $6",
    [address_id, date, phone, car_id, worker_id, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});


app.delete("/api/transportDelete/:id", (req, res) => {
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

app.get("/api/TransportsLookup", (req, res) => {
  client.query("SELECT * from get_transports_4_lookup()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

//ZipCode

app.get("/api/ZipCodesLookup", (req, res) => {
  client.query("SELECT * from get_zip_codes_4_lookup()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

//Car
app.post("/api/carCreate", (req, res) => {
  const registration_number = req.body.registration_number;
  const overview_date = req.body.overview_date;

  client.query(
    "INSERT INTO cars (registration_number, overview_date) VALUES ($1,$2)",
    [registration_number, overview_date],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result.rows);
      }
    }
  );
});

app.get("/api/car/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT * FROM cars WHERE car_id = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result.rows[0]);
      }
    });
});

app.get("/api/cars", (req, res) => {
  client.query("SELECT car_id, registration_number, to_char(overview_date, 'YYYY-MM-DD') overview_date, case when car_id in (select car_id FROM transports) then '0' else '1' END AS can_delete FROM cars", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

app.put("/api/carUpdate", (req, res) => {
  const id = req.body.id;
  const registration_number = req.body.registration_number;
  const overview_date = req.body.overview_date;

  client.query(
    "Update cars set registration_number = $1, overview_date = $2 where car_id = $3",
    [registration_number, overview_date, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/api/carDelete/:id", (req, res) => {
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

app.get("/api/CarsLookup", (req, res) => {
  client.query("SELECT * from get_car_4_lookup()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

//Address
app.get("/api/addresses", (req, res) => {
  client.query("SELECT a.address_id, a.street, a.house_number, a.flat_number, z.city, z.province, z.zip_code, case when a.address_id in (select address_id FROM transports) then '0' else '1' END AS can_delete FROM public.addresses a inner join zip_codes z on z.zip_code_id = a.zip_code_id;", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

app.post("/api/addressCreate", (req, res) => {
  const street = req.body.street;
  const house_number = req.body.house_number;
  const flat_number = req.body.flat_number;
  const zip_code_id = req.body.zip_code_id;

  client.query(
    "INSERT INTO addresses (street, house_number, flat_number, zip_code_id) VALUES ($1,$2,$3,$4)",
    [street, house_number, flat_number, zip_code_id],
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

app.get("/api/address/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT street, house_number, flat_number, zip_code_id FROM addresses WHERE address_id = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result.rows[0]);
      }
    });
});

app.get("/api/lastAddress", (req, res) => {
  client.query("SELECT concat(a.street, ' ', a.house_number, ' ', a.flat_number, ', ', z.city) as label, a.address_id as id FROM addresses a inner join public.zip_codes z on z.zip_code_id = a.zip_code_id order by address_id desc LIMIT 1",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result.rows[0]);
      }
    });
});


app.put("/api/addressUpdate", (req, res) => {
  const street = req.body.street;
  const house_number = req.body.house_number;
  const flat_number = req.body.flat_number;
  const zip_code_id = req.body.zip_code_id;
  const id = req.body.id;

  client.query(
    "Update addresses set street = $1, house_number = $2, flat_number = $3, zip_code_id = $4 where address_id = $5",
    [street, house_number, flat_number, zip_code_id, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/api/addressDelete/:id", (req, res) => {
  const id = req.params.id;
  client.query("DELETE FROM addresses WHERE address_id = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

app.get("/api/addressLookup", (req, res) => {
  client.query("SELECT * FROM get_addresses_lookup()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

//ZIPCode

app.get("/api/zipCodes", (req, res) => {
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
app.get("/api/customers", (req, res) => {
  client.query("SELECT c.contractor_id as id, *, c.name, CASE WHEN f.nip is not null then 'C' else 'P' END AS type, case when c.contractor_id in (select contractor_id FROM purchases union SELECT contractor_id FROM sales) then 0 else 1 END AS can_delete FROM contractors c left join companies f on c.contractor_id= f.contractor_id left join customers k on c.contractor_id= k.contractor_id", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

app.get("/api/customer/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT c.*, cu.*, co.*, c.name FROM contractors c left join customers cu on cu.contractor_id = c.contractor_id left join companies co on co.contractor_id = c.contractor_id where c.contractor_id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows[0]);
    }
  });
});

app.post("/api/customerCreate", (req, res) => {
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

app.put("/api/customerUpdate", (req, res) => {
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

app.delete("/api/customerDelete/:id", (req, res) => {
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

app.get("/api/CustomersLookup", (req, res) => {
  client.query("SELECT id_number || ' ' || COALESCE(name, '')  as label, contractor_id as id FROM customers order by label", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

//company
app.post("/api/companyCreate", (req, res) => {
  const name = req.body.name;
  const nip = req.body.nip;
  const account_number = req.body.account_number;
  const email = req.body.email;

  client.query(
    "INSERT INTO companies (name, nip, account_number, email) VALUES ($1,$2,$3, $4)",
    [name, nip, account_number, email],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/api/companyUpdate", (req, res) => {
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

app.get("/api/CompaniesLookup", (req, res) => {
  client.query("SELECT name as label, contractor_id as id FROM companies order by label", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

//Purchase
app.get("/api/purchases", (req, res) => {
  client.query("SELECT * from get_purchases()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});


//Documents
app.get("/api/saleInit", (req, res) => {
  client.query("select init_sale(0)", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

app.get("/api/purchaseInit", (req, res) => {
  client.query("select init_purchase(0)", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

app.put("/api/saleDocumentUpdate", (req, res) => {
  const document_id = req.body.document_id;
  const contractor_Id = req.body.contractor_Id;
  let transport_Id = req.body.transport_Id;
  if (transport_Id === undefined) transport_Id = null;

  client.query(
    "Update sales set contractor_Id = $1, transport_Id = $2 where document_id = $3",
    [contractor_Id, transport_Id, document_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result)
        res.send(result);
      }
    }
  );
});

app.put("/api/purchaseDocumentUpdate", (req, res) => {
  const document_id = req.body.document_id;
  const contractor_Id = req.body.contractor_Id;
  let transport_Id = req.body.transport_Id;
  if (transport_Id === undefined) transport_Id = null;

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

app.put("/api/purchaseDocumentUpdateAndAddPerson", (req, res) => {
  const document_id = req.body.document_id;
  const id_number = req.body.id_number;
  const transport_Id = req.body.transport_Id;
  if (transport_Id === undefined) transport_Id = null;

  client.query(
    "call update_purchase_with_new_client($1, $2, $3)",
    [id_number, transport_Id, document_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/api/document/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT d.* FROM documents d where d.document_id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows[0]);
    }
  });
});

app.get("/api/sale/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT d.* FROM sales d where d.document_id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows[0]);
    }
  });
});

app.get("/api/purchase/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT d.* FROM purchases d where d.document_id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows[0]);
    }
  });
});

app.delete("/api/documentDelete/:id", (req, res) => {
  const id = req.params.id;
  client.query("DELETE FROM documents WHERE document_id = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

//Sale
app.get("/api/sales", (req, res) => {
  client.query("SELECT * from get_sales()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

app.put("/api/saleUpdateStatus", (req, res) => {
  const id = req.body.id;
  const status_id = req.body.status_id;
  if (status_id >= 0 && status_id <= 3) {
    client.query("update sales set status_id = $2 WHERE document_id = $1", [id, status_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result.rows[0]);
      }
    });
  }
});

app.put("/api/SaleUpdatePayment", (req, res) => {
  const id = req.body.id;
  const val = req.body.val;

  if (val) {
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
app.post("/api/workerCreate", (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const id_number = req.body.id_number;
  const role_id = req.body.role_id;

  client.query(
    "INSERT INTO workers (name, surname, id_number, role_id) VALUES ($1,$2,$3,$4)",
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

app.get("/api/workers", (req, res) => {
  client.query("SELECT w.worker_id, w.name, w.surname, w.id_number, r.name as role_name, case when w.worker_id in (select worker_id FROM transports) then '0' else '1' END AS can_delete FROM public.workers w inner join public.roles r on r.role_id = w.role_id;", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

app.get("/api/worker/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT w.worker_id, w.name, w.surname, w.id_number, r.role_id, r.name as role_name FROM public.workers w inner join public.roles r on r.role_id = w.role_id WHERE worker_id = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result.rows[0]);
      }
    });
});

app.put("/api/workerUpdate", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const surname = req.body.surname;
  const id_number = req.body.id_number;
  const role_id = req.body.role_id;

  client.query(
    "Update workers set name = $1, surname = $2, id_number = $3, role_id = $4 where worker_id = $5",
    [name, surname, id_number, role_id, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/api/workerDelete/:id", (req, res) => {
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

app.get("/api/WorkersLookup", (req, res) => {
  client.query("SELECT * from get_drivers_4_lookup()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

//WorkerRole

app.get("/api/roles", (req, res) => {
  client.query("SELECT name as label, role_id as id FROM roles order by label", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
      return;
    }
  });
});

//Product
app.get("/api/documentProducts/:id", (req, res) => {
  const id = req.params.id;
  client.query("SELECT * from get_document_products($1)", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
    }
  });
});

//ProductsType
app.get("/api/productTypes", (req, res) => {
  client.query("SELECT type_id, name, 0 as weight, 0 as price from product_type", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
    }
  });
});

app.get("/api/getStock", (req, res) => {
  client.query("SELECT * from get_stock()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
    }
  });
});

app.put("/api/productUpdate", (req, res) => {
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

//CarsAfterOverviewDate
app.get("/api/getOldCars", (req, res) => {
  client.query("SELECT * from get_old_cars()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
    }
  });
});

//oldSales
app.get("/api/getOldSales", (req, res) => {
  client.query("select * from get_old_sales()", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
    }
  });
});

app.get("*", (req,res) => {
  res.sendFile(
    path.join(__dirname,"../abc-recycling-app/build/index.html")
  )
})

app.listen(process.env.PORT || 3001, () => {
  console.log("Your server is running on port 3001");
});