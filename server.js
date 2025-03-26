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

app.delete('/exercises/:exercise_id', async (req, res) => {
  try {
    const { exercise_id } = req.params;

    if (!exercise_id) {
      return res.status(400).json({ error: 'exercise_id is required' });
    }

    // Query to fetch all exercises for the given exercise_id
    const exercisesQuery = `
      SELECT * 
      FROM exercises 
      WHERE exercise_id = $1
    `;
    const exercisesResult = await db.query(exercisesQuery, [exercise_id]);

    if (exercisesResult.rows.length === 0) {
      return res.status(404).json({ error: 'No exercises found for the selected theme.' });
    }

    res.json({ exercises: exercisesResult.rows });
  } catch (err) {
    console.error('Error deleting exercise with id:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/exercises/:exercise_id', async (req, res) => {
  try {
    const { exercise_id } = req.params;
    if (!exercise_id) {
      return res.status(400).json({ error: 'exercise_id is required' });
    }

    // Extract fields to update from the request body
    const { description, correct_answer, points, hints, difficulty_level } = req.body;

    // Validate that at least one field is provided for update.
    if (description === undefined && correct_answer === undefined && points === undefined && hints === undefined && difficulty_level === undefined) {
      return res.status(400).json({ error: 'At least one field must be provided for update.' });
    }

    // Convert hints array to a valid JSON string if provided.
    let hintsJson = hints;
    if (hints !== undefined) {
      hintsJson = JSON.stringify(hints);
    }

    // Construct the UPDATE query using COALESCE.
    const updateQuery = `
      UPDATE exercises
      SET 
        description = COALESCE($1, description),
        correct_answer = COALESCE($2, correct_answer),
        points = COALESCE($3, points),
        hints = COALESCE($4::jsonb, hints),
        difficulty_level = COALESCE($5, difficulty_level)
      WHERE exercise_id = $6
      RETURNING *;
    `;
    const values = [description, correct_answer, points, hintsJson, difficulty_level, exercise_id];

    const updateResult = await db.query(updateQuery, values);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exercise not found.' });
    }

    res.json({ updatedExercise: updateResult.rows[0] });
  } catch (err) {
    console.error('Error updating exercise:', err);
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

// POST /exercises - Create a new exercise with auto-assigned theme_id
app.post('/admin/exercises', async (req, res) => {
  try {
    // Destructure fields from the request body.
    const { theme_id, difficulty_level, description, points, correct_answer, hints } = req.body;

    // Validate required fields.
    if (!theme_id || !difficulty_level || !description || points === undefined || !correct_answer) {
      return res.status(400).json({ error: 'Missing required fields: theme_id, difficulty_level, description, points, correct_answer' });
    }

    // Process hints: if hints is not provided, set it to an empty array (stringified) so that the jsonb column gets a valid JSON.
    const hintsValue = hints ? hints : JSON.stringify([]);

    // Build the INSERT query including the image and hints fields.
    const insertQuery = `
      INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [theme_id, difficulty_level, description, points, correct_answer, hintsValue];

    const result = await db.query(insertQuery, values);
    res.status(201).json({ exercise: result.rows[0] });
  } catch (error) {
    console.error('Error creating new exercise:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/admin/statistics', async (req, res) => {
  try {
    const query = `
        SELECT 
  CONCAT(u.first_name, ' ', u.last_name) AS full_name,
  ts.points_scored,
  ts.submitted_at AS submission_date,
  t.exercises AS test_exercises,
  COALESCE((
    SELECT SUM((ex ->> 'points')::int)
    FROM jsonb_array_elements(t.exercises) AS ex
  ), 0) AS max_points
FROM Test_Submissions ts
JOIN Users u ON ts.user_id = u.user_id
JOIN Tests t ON ts.test_id = t.test_id
ORDER BY ts.submitted_at DESC;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/statistics/:user_id', async (req, res) => {
  try {
    // Retrieve and parse the user_id from the URL parameter
    const userId = parseInt(req.params.user_id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user_id parameter' });
    }
    const query = `
      SELECT
      ts.test_id,
        ts.points_scored,
        ts.submitted_at AS submission_date,
        t.exercises AS test_exercises,
        COALESCE((
          SELECT SUM((ex ->> 'points')::int)
          FROM jsonb_array_elements(t.exercises) ex
        ), 0) AS max_points
      FROM test_submissions ts
      JOIN tests t ON ts.test_id = t.test_id
      WHERE ts.user_id = $1
      ORDER BY ts.submitted_at DESC;
    `;

    const result = await db.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching statistics for user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/admin/submissions-over-time', async (req, res) => {
  try {
    const query = `
SELECT 
    DATE(submitted_at) AS submission_date,
    COUNT(*) AS total_submissions
FROM test_submissions
GROUP BY DATE(submitted_at)
ORDER BY submission_date;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/admin/avg-percentage-scores', async (req, res) => {
  try {
    const query = `
SELECT 
    t.test_id,
    AVG(ts.points_scored) AS avg_points
FROM test_scores ts
JOIN tests t ON t.test_id = ts.test_id
GROUP BY t.test_id
ORDER BY t.test_id;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/admin/avg-points-per-exercise', async (req, res) => {
  try {
    const query = `
SELECT 
    ts.points_scored,
    COUNT(*) AS frequency
FROM test_scores ts
GROUP BY ts.points_scored
ORDER BY ts.points_scored;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/percentile/overall/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid userId parameter' });
    }

    // Aggregate total points for each user from test_submissions.
    const aggregateQuery = `
      SELECT user_id, SUM(points_scored) AS total_points
      FROM test_submissions
      GROUP BY user_id;
    `;
    const result = await db.query(aggregateQuery);
    const totals = result.rows;

    if (totals.length === 0) {
      return res.status(404).json({ error: 'No submissions found' });
    }

    // Find the total points for the current user.
    const userRecord = totals.find(record => parseInt(record.user_id) === userId);
    if (!userRecord) {
      return res.status(404).json({ error: 'User has no submissions' });
    }
    const userTotal = parseInt(userRecord.total_points, 10);

    // Count how many users have total_points less than or equal to the user's total.
    const countBelowOrEqual = totals.filter(record => parseInt(record.total_points, 10) <= userTotal).length;

    // Calculate the percentile rank.
    const percentile = (countBelowOrEqual / totals.length) * 100;

    res.json({ percentile: percentile });
  } catch (error) {
    console.error('Error computing overall percentile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const query = `
      SELECT u.email, SUM(ts.points_scored) AS total_points
FROM test_submissions ts
JOIN Users u ON ts.user_id = u.user_id
GROUP BY u.email
ORDER BY total_points DESC;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
