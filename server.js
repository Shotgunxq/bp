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

app.post('/tests', async (req, res) => {
  try {
    const { cas_na_pisanie, tasks } = req.body;

    if (!cas_na_pisanie || !tasks || !Array.isArray(tasks)) {
      return res.status(400).send('Bad Request: cas_na_pisanie and tasks are required.');
    }

    // Insert the test
    const testResult = await db.query('INSERT INTO tests (cas_na_pisanie) VALUES ($1) RETURNING *', [cas_na_pisanie]);
    const test = testResult.rows[0];

    // Insert tasks
    const taskPromises = tasks.map(task =>
      db.query('INSERT INTO tasks (test_id, task_id) VALUES ($1, $2) RETURNING *', [test.test_id, task.task_id])
    );

    const taskResults = await Promise.all(taskPromises);

    res.json({
      test,
      tasks: taskResults.map(result => result.rows[0]),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
