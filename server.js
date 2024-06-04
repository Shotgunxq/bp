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

    const easyQuery = db.query('SELECT * FROM exercises WHERE difficulty = $1 ORDER BY RANDOM() LIMIT $2', ['easy', parseInt(easy, 10)]);
    const mediumQuery = db.query('SELECT * FROM exercises WHERE difficulty = $1 ORDER BY RANDOM() LIMIT $2', ['medium', parseInt(medium, 10)]);
    const hardQuery = db.query('SELECT * FROM exercises WHERE difficulty = $1 ORDER BY RANDOM() LIMIT $2', ['hard', parseInt(hard, 10)]);

    const [easyResult, mediumResult, hardResult] = await Promise.all([easyQuery, mediumQuery, hardQuery]);

    const allExercises = [...easyResult.rows, ...mediumResult.rows, ...hardResult.rows];

    res.json({ exercises: allExercises });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/tests', async (req, res) => {
  try {
    const { exercises, cas_na_pisanie } = req.body;

    // if (!exercises || !cas_na_pisanie || !Array.isArray(exercises)) {
    //   return res.status(400).send('Bad Request: exercises and cas_na_pisanie are required and exercises should be an array.');
    // }

    const testResult = await db.query('INSERT INTO tests (exercises, cas_na_pisanie) VALUES ($1::jsonb, $2::time) RETURNING *', [
      JSON.stringify(exercises),
      cas_na_pisanie,
    ]);
    const test = testResult.rows[0];

    res.json(test);
  } catch (err) {
    console.error('Error in POST /tests:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
