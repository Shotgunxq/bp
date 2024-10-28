const express = require('express');
const db = require('./db');
const cors = require('cors');

const bodyParser = require('body-parser');
const { authenticate } = require('ldap-authentication');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // Parse JSON bodies


async function ldapAuth(username, password) {
  try {
    let options = {
      ldapOpts: {
        url: 'ldap://ldap.stuba.sk', // External LDAP server
      },
      userDn: `uid=${username},ou=People,dc=stuba,dc=sk`, // This constructs the user DN
      userPassword: password, // The password from the input
      userSearchBase: 'ou=People,dc=stuba,dc=sk', // Base where users are located in the LDAP directory
      usernameAttribute: 'uid',
      username: username,
    };

    // Authenticate the user against the external LDAP server
    let user = await authenticate(options);
    
    return user;
  } catch (error) {
    throw new Error('LDAP bind failed: ' + error.message);
  }
}

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Authenticate user
    const user = await ldapAuth(username, password);
    
    // Send the user info back to the client
    res.status(200).json(user); 
  } catch (error) {
    // Send authentication failure message
    res.status(401).send('Authentication failed: ' + error.message);
  }
});

app.get('/', (req, res) => {
  try {
    res.send('Hello World');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

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
    res.status(500).send(err);
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
    res.status(403).send('Bad Request');
  }
});

app.post('/submit', async (req, res) => {
  const { user_id, test_id, points, timestamp } = req.body;

  try {
    const result = await db.query('INSERT INTO test_submissions (user_id, test_id, points, timestamp) VALUES ($1, $2, $3, $4) RETURNING *', [
      user_id,
      test_id,
      points,
      timestamp,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('ERROR: ',err);
    res.status(403).json({ error: 'Bad Request' });
  }
});

app.get('/api/test/:test_id', async (req, res) => {
  const { test_id } = req.params;
  console.log(`Received request for test_id: ${test_id}`);

  try {
    const testQuery = `
      SELECT *
      FROM tests
      WHERE test_id = $1
    `;

    const testResult = await db.query(testQuery, [test_id]);
    console.log('Query executed successfully:', testResult.rows);

    // Send the entire row data to the client
    res.json(testResult.rows[0]); // Send the first row as JSON
  } catch (error) {
    console.error('Error fetching test data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
