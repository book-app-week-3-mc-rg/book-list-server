'use strict';

//Application dependencies

const express = require('express');
const pg = require('pg');
const cors = require('cors');

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
app.get('/api/v1/books', (req, res) => {
  client.query(`
  SELECT book_id, author, title, image_url FROM books`)
    .then(result => res.send(result.rows))
    .catch(console.error);
});


app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));