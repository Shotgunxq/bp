const express = require('express');
const db = require('./db');

const app = express();

app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM easy_exercises');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// const app = require('express')();
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}.`);
// });

// app.get('/asd', (req, res) => {
//     res.status(200);
//     res.send('Hello World');
// });