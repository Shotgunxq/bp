-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    user_id SERIAL PRIMARY KEY,
    meno VARCHAR,
    type VARCHAR,
    username VARCHAR UNIQUE,
    password VARCHAR,
    log_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Tests table with exercises column in jsonb format
CREATE TABLE IF NOT EXISTS Tests (
    test_id SERIAL PRIMARY KEY,
    cas_na_pisanie TIME,
    exercises JSONB  -- JSONB column to store exercises
);

-- Create Exercises table
CREATE TABLE IF NOT EXISTS exercises (
    exercise_id SERIAL PRIMARY KEY,  -- Changed from task_id to exercise_id for clarity
    difficulty VARCHAR,  -- Can be 'easy', 'medium', 'hard'
    description VARCHAR,
    image BYTEA,  -- Assuming image is stored as bytea (binary data)
    points INTEGER,
    answer VARCHAR
);

-- Create Test_Submissions table to store user submissions
CREATE TABLE IF NOT EXISTS Test_Submissions (
    submission_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(user_id) ON DELETE CASCADE,
    test_id INTEGER REFERENCES Tests(test_id) ON DELETE CASCADE,
    points INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Test_Scores table to store test results and points
CREATE TABLE IF NOT EXISTS Test_Scores (
    score_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(user_id) ON DELETE CASCADE,
    test_id INTEGER REFERENCES Tests(test_id) ON DELETE CASCADE,
    points INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
