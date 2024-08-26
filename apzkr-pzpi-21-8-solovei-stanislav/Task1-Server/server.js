const connection = require('./mysql/mysql');
const express = require('express');
const session = require('express-session');
const cors = require('cors');

const userManager = require("./classes/UserManager/UserManager");
const bcrypt = require("bcrypt");

const app = express();
const router = express.Router();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(session({
  secret: 'stanislav',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 10 * 60 * 1000}
}));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = 5000;

app.get('/api/v1/users', async (req, res) => {
  try {
    const sql = 'SELECT * FROM user';

    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching users data: ', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(results);
      }
    });
  } catch (e) {
    console.error(e);
  }
});

app.get('/api/v1/materials', async (req, res) => {
  try {
    const sql = 'SELECT * FROM material';

    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching materials data: ', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(results);
      }
    });
  } catch (e) {
    console.error(e);
  }
});

app.post('/api/v1/materials', async (req, res) => {
  const {name, quantity, service_id} = req.body;

  try {
    const sql = 'INSERT INTO material (name, quantity, service_id) VALUES (?, ?, ?)';
    const values = [name, quantity, service_id];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting data into the database: ', err);
      } else {
        console.log('Data inserted successfully');
      }
    });
  } catch (e) {
    console.error('Error: ', e);
  }

  res.status(200).send('Material added successfully');
});

app.delete('/api/v1/materials/:materialId', (req, res) => {
  const materialId = req.params.materialId;

  const sql = 'DELETE FROM material WHERE id = ?';
  connection.query(sql, [materialId], (err, result) => {
    if (err) {
      console.error('Error deleting service: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.affectedRows > 0) {
        res.status(200).send('Service deleted successfully');
      } else {
        res.status(404).send('Service not found');
      }
    }
  });
});

app.get('/api/v1/services', async (req, res) => {
  try {
    const sql = 'SELECT * FROM service';

    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching services data: ', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(results);
      }
    });
  } catch (e) {
    console.error(e);
  }
});

app.post('/api/v1/services', async (req, res) => {
  const {name, description, price} = req.body;

  try {
    const sql = 'INSERT INTO service (name, description, price) VALUES (?, ?, ?)';
    const values = [name, description, price];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting data into the database: ', err);
      } else {
        console.log('Data inserted successfully');
      }
    });
  } catch (e) {
    console.error('Error: ', e);
  }

  res.status(200).send('Service added successfully');
});

app.delete('/api/v1/services/:serviceId', (req, res) => {
  const serviceId = req.params.serviceId;

  const sql = 'DELETE FROM service WHERE id = ?';
  connection.query(sql, [serviceId], (err, result) => {
    if (err) {
      console.error('Error deleting service: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.affectedRows > 0) {
        res.status(200).send('Service deleted successfully');
      } else {
        res.status(404).send('Service not found');
      }
    }
  });
});

app.get('/api/v1/cleaning', async (req, res) => {
  try {
    const sql = 'SELECT * FROM cleaning';

    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching services data: ', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(results);
      }
    });
  } catch (e) {
    console.error(e);
  }
});

app.post('/api/v1/cleaning', async (req, res) => {
  const {
    date,
    time,
    description,
    user_id,
    service_id
  } = req.body;

  try {
    const sql = 'INSERT INTO cleaning (date, time, description, user_id, service_id) VALUES (?, ?, ?, ?, ?)';
    const values = [date, time, description, user_id, service_id];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting data into the database: ', err);
      } else {
        console.log('Data inserted successfully');
      }
    });
  } catch (e) {
    console.error('Error: ', e);
  }

  res.status(200).send('Service added successfully');
});

app.delete('/api/v1/cleaning/:cleaningId', (req, res) => {
  const cleaningId = req.params.cleaningId;

  const sql = 'DELETE FROM cleaning WHERE id = ?';
  connection.query(sql, [cleaningId], (err, result) => {
    if (err) {
      console.error('Error deleting user: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.affectedRows > 0) {
        res.status(200).send('Cleaning deleted successfully');
      } else {
        res.status(404).send('Cleaning not found');
      }
    }
  });
});

app.get('/api/v1/users/:userId', (req, res) => {
  const userId = req.params.userId;

  const sql = 'SELECT * FROM user WHERE id = ?';
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user details: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.length > 0) {
        const userDetails = result[0];
        res.status(200).json(userDetails);
      } else {
        res.status(404).send('User not found');
      }
    }
  });
});

app.delete('/api/v1/users/:userId', (req, res) => {
  const userId = req.params.userId;

  const sql = 'DELETE FROM user WHERE id = ?';
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.affectedRows > 0) {
        res.status(200).send('User deleted successfully');
      } else {
        res.status(404).send('User not found');
      }
    }
  });
});

app.post('/api/v1/login', async (req, res) => {
  const {login, password} = req.body;

  try {
    const user = await userManager.login(login, password, connection);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).send('Authentication failed');
    }
  } catch (error) {
    console.error('Error during login: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/v1/users', async (req, res) => {
  const {login, first_name, phone_number, password, is_admin} = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO user (login, first_name, phone_number, password, is_admin) VALUES (?, ?, ?, ?, ?)';
    const values = [login, first_name, phone_number, password, is_admin];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting data into the database: ', err);
      } else {
        console.log('Data inserted successfully');
      }
    });
  } catch (e) {
    console.error('Error hashing password: ', e);
  }

  res.status(200).send('User added successfully');
});

app.post('/api/v1/register', async (req, res) => {
  const {login, firstName, phone, password} = req.body;

  await userManager.registerUser(login, firstName, phone, password, connection);

  res.sendStatus(200);
});

app.listen(PORT, '', null, () => console.log(`Server started on port ${PORT}`));
