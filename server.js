'use strict';

//Application dependencies

const express = require('express');
const pg = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

//application setup

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

// Database setup

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

//api inputs

// app.get('/api/v1/books', (req, res) => res.send('It is alive!!!'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/v1/books', (req, res) => {
  client.query(`
  SELECT book_id, author, title, image_url FROM books ORDER BY title`)
    .then(result => res.send(result.rows))
    .catch(console.error);
});

//fetching single book from the database
app.get('/api/v1/books/:id', (req, res) => {
  client.query(`
  SELECT book_id, author, title, isbn, image_url, description FROM books WHERE book_id =$1`, [req.params.id])
    .then(result => res.send(result.rows))
    .catch(console.error);
});

//Post route to create new database entry
app.post('/api/v1/books', (req, res) => {
  client.query(`
  INSERT INTO books(author, title, isbn, image_url, description
    VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`), [req.body.author, req.body.title, req.body.isbn, req.body.image_url, req.body.description]
    .then(result => res.send(result.rows))
    .catch(console.error);
});


app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));