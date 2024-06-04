const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/test/api', async (req, res) => {
  try {
    const { easy, medium, hard } = req.query;

    const easyQuery = db.query('SELECT * FROM exercises WHERE difficulty = $1 ORDER BY RANDOM() LIMIT $2', ['easy', easy]);
    const mediumQuery = db.query('SELECT * FROM exercises WHERE difficulty = $1 ORDER BY RANDOM() LIMIT $2', ['medium', medium]);
    const hardQuery = db.query('SELECT * FROM exercises WHERE difficulty = $1 ORDER BY RANDOM() LIMIT $2', ['hard', hard]);

    const [easyResult, mediumResult, hardResult] = await Promise.all([easyQuery, mediumQuery, hardQuery]);

    const responseData = {
      easy: easyResult.rows,
      medium: mediumResult.rows,
      hard: hardResult.rows,
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Backend endpoint to handle POST requests to create tests
app.post('/tests', async (req, res) => {
  try {
    const { exercises, cas_na_pisanie } = req.body;

    // Check if required fields are provided and are of the correct type
    if (!exercises || !cas_na_pisanie || !Array.isArray(exercises)) {
      return res.status(400).send('Bad Request: exercises and cas_na_pisanie are required and exercises should be an array.');
    }

    // Insert the test
    const testResult = await db.query('INSERT INTO tests (exercises, cas_na_pisanie) VALUES ($1::jsonb, $2::time) RETURNING *', [
      JSON.stringify(exercises),
      cas_na_pisanie,
    ]);
    const test = testResult.rows[0];

    res.json(test);
  } catch (err) {
    console.error('Aaaaaaa ', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
