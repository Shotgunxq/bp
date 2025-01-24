const express = require('express');
const db = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const { authenticate } = require('ldap-authentication');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
const session = require('express-session');

app.use(bodyParser.json());
app.use(
  session({
    secret: '1', // Replace with a strong secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }, // Set to `true` if using HTTPS
  })
);

// LDAP authentication function
async function ldapAuth(username, password) {
  try {
    const options = {
      ldapOpts: { url: 'ldap://ldap.stuba.sk' },
      userDn: `uid=${username},ou=People,dc=stuba,dc=sk`,
      userPassword: password,
      userSearchBase: 'ou=People,dc=stuba,dc=sk',
      usernameAttribute: 'uid',
      username: username,
    };

    const user = await authenticate(options);
    return user;
  } catch (error) {
    throw new Error('LDAP bind failed: ' + error.message);
  }
}

// User login route using LDAP authentication
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await ldapAuth(username, password);
    const processedUser = {
      userId: user.uisId, // Map uisId to userId
      employeeType: user.employeeType,
      givenName: user.givenName,
      lastName: user.sn, // Map sn to lastName
      email: user.mailLocalAddress[1],
    };

    try {
      const existingUser = await db.findUserById(processedUser.userId);
      console.log('Existing user:', existingUser);
      console.log('Processed user AIS ID:', processedUser.userId);
      if (!existingUser) {
        console.log('User not found in database, inserting new user...');
        await db.insertUser(processedUser);
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError.message);
    }

    res.status(200).json(processedUser); // Send processed user data
    console.log('User authenticated:', processedUser);
    // console.log('LDAP user data:', user);
    // res.status(200).json(user);
  } catch (error) {
    res.status(401).send('Authentication failed: ' + error.message);
  }
});

// Basic hello route
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/themes', async (req, res) => {
  try {
    // const themesQuery = 'SELECT theme_id, theme_name FROM themes WHERE theme_id != 0';
    const themesQuery = 'SELECT theme_id, theme_name FROM themes';
    const themesResult = await db.query(themesQuery);

    res.json(themesResult.rows);
  } catch (err) {
    console.error('Error fetching themes:', err);
    res.status(500).json({ error: 'Failed to fetch themes' });
  }
});

app.get('/test/api', async (req, res) => {
  try {
    const { easy, medium, hard, themes } = req.query;

    const easyCount = parseInt(easy, 10) || 0;
    const mediumCount = parseInt(medium, 10) || 0;
    const hardCount = parseInt(hard, 10) || 0;

    // Parse the selected themes (comma-separated)
    const themeIds = themes ? themes.split(',').map(id => parseInt(id, 10)) : [];

    const whereClause = themeIds.length > 0 ? 'AND theme_id = ANY($3::int[])' : '';

    const easyQuery = db.query(
      `SELECT * FROM exercises WHERE difficulty_level = $1 ${whereClause} ORDER BY RANDOM() LIMIT $2`,
      themeIds.length > 0 ? ['easy', easyCount, themeIds] : ['easy', easyCount]
    );

    const mediumQuery = db.query(
      `SELECT * FROM exercises WHERE difficulty_level = $1 ${whereClause} ORDER BY RANDOM() LIMIT $2`,
      themeIds.length > 0 ? ['medium', mediumCount, themeIds] : ['medium', mediumCount]
    );

    const hardQuery = db.query(
      `SELECT * FROM exercises WHERE difficulty_level = $1 ${whereClause} ORDER BY RANDOM() LIMIT $2`,
      themeIds.length > 0 ? ['hard', hardCount, themeIds] : ['hard', hardCount]
    );

    const [easyResult, mediumResult, hardResult] = await Promise.all([easyQuery, mediumQuery, hardQuery]);

    const allExercises = [...easyResult.rows, ...mediumResult.rows, ...hardResult.rows];

    if (allExercises.length === 0) {
      return res.status(404).json({ error: 'No exercises found for the selected themes and difficulty levels.' });
    }

    res.json({ exercises: allExercises });
  } catch (err) {
    console.error('Error in /test/api:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/themes/:theme_id/exercises', async (req, res) => {
  try {
    const { theme_id } = req.params;

    if (!theme_id) {
      return res.status(400).json({ error: 'theme_id is required' });
    }

    // Query to fetch all exercises for the given theme_id
    const exercisesQuery = `
      SELECT * 
      FROM exercises 
      WHERE theme_id = $1
    `;
    const exercisesResult = await db.query(exercisesQuery, [parseInt(theme_id, 10)]);

    if (exercisesResult.rows.length === 0) {
      return res.status(404).json({ error: 'No exercises found for the selected theme.' });
    }

    res.json({ exercises: exercisesResult.rows });
  } catch (err) {
    console.error('Error fetching exercises for theme:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new test entry
app.post('/tests', async (req, res) => {
  try {
    const { exercises, writing_time } = req.body;

    const testResult = await db.query('INSERT INTO tests (exercises, writing_time) VALUES ($1::jsonb, $2::time) RETURNING *', [
      JSON.stringify(exercises),
      writing_time,
    ]);
    const test = testResult.rows[0];

    res.json(test);
  } catch (err) {
    console.error('Error in POST /tests:', err);
    res.status(403).send('Bad Request');
  }
});

// Submit a test
app.post('/submit', async (req, res) => {
  const { user_id, test_id, points, timestamp } = req.body;
  console.log('Parsed Request Body:', req.body); // Log the body

  if (!user_id) {
    return res.status(400).json({ error: 'Missing required field: user_id is required.' });
  }

  if (!test_id) {
    return res.status(400).json({ error: 'Missing required field: test_id is required.' });
  }
  if (typeof points !== 'number') {
    return res.status(400).json({ error: 'Invalid points value' });
  }

  if (points === undefined || points === null) {
    return res.status(400).json({ error: 'Missing required field: points is required.' });
  }
  if (typeof points !== 'number') {
    return res.status(400).json({ error: 'Invalid points value' });
  }

  if (!timestamp) {
    return res.status(400).json({ error: 'Missing required field: timestamp is required.' });
  }

  try {
    const userCheck = await db.query('SELECT 1 FROM users WHERE user_id = $1', [user_id]);
    if (userCheck.rowCount === 0) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    const result = await db.query(
      'INSERT INTO test_submissions (user_id, test_id, points_scored, submitted_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, test_id, points, timestamp]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('ERROR: ', err);
    res.status(403).json({ error: 'Bad Request' });
  }
});

// Retrieve a specific test
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

    res.json(testResult.rows[0]); // Send the first row as JSON
  } catch (error) {
    console.error('Error fetching test data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
