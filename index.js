const express = require("express");
const app = express();
const mysql = require('mysql');



const PORT = 3001;

// 1. Root url "/" (metode GET) khusus untuk mengembalikan object di bawah ini. Isi sesuai data kalian masing-masing
const db = [
    {
        name: "Grace",
        origin: "Solo",
        role: "Backend Developer",
    },
];

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ data: db });
});

// 2. Get semua data
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mypassword',
    database: 'data_crud',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database!');
});

connection.query(
"CREATE TABLE IF NOT EXISTS users(ID int,NAME varchar(150),AGE int,ORIGIN varchar(100),isEmployed Boolean,PRIMARY KEY(ID))",
    (err, result) => {
        if(err) {
            throw err;
        }
        console.log("Users table created successfully!");
    }
);

app.get("/users", (req, res) => {
        connection.query("SELECT * FROM users", function(err, result, fields){
            if(err) {
                console.log(err);
                res.status(500).json({ message : "Internal server error" });
            } else {
                res.json(result)
            }
        })
});

// 3. Get data by ID
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM users WHERE ID = ?', id, (err,result) => {
        if(err){
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        } else if (!result) {
            res.status(404).json({ message: 'Data with ID ${id} is not found!' });
            return;
        } else {
            res.status(200).json(result);
        }
    })
});
        

// 4. Create new data
app.post("/users", (req, res) => {
    const { ID, NAME, AGE, ORIGIN, isEmployed } = req.body;
    if (!ID || !NAME || !AGE || !ORIGIN) {
        res.status(400).json({ message: "ID, Name, age, origin, isEmployed must be filled!" });
        return;
    }

    connection.query('INSERT INTO users VALUES (?, ?, ?, ?, ?)',[ID, NAME, AGE, ORIGIN, isEmployed], (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.status(200).json(result);
        }
    })
});

// 5. Update data by ID
app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const { NAME, AGE, ORIGIN, isEmployed } = req.body;
    if (!id || !NAME || !AGE || !ORIGIN ) {
        res.status(400).json({ message: "ID, Name, age, origin, isEmployed must be filled!" });
        return;
    }
    connection.query('UPDATE users SET NAME=?, AGE=?, ORIGIN=?, isEmployed=? WHERE ID=?',[NAME, AGE, ORIGIN, isEmployed, id], (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        } else if (!result) {
            res.status(404).json({ message: 'Data with ID ${id} is not found!' });
            return;
        } else {
            res.status(200).json(result);
        }
    })
});

// 6. Delete data by ID
app.delete("/users/:id", (req, res) => {
    const id = req.params.id;

    connection.query('DELETE FROM users WHERE ID=?',id,(err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        } else if (!result) {
            res.status(404).json({ message: 'Data with ID ${id} is not found!' });
            return;
        } else {
            res.status(200).json(result);
        }
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
