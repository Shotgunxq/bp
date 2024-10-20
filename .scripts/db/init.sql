-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    user_id SERIAL PRIMARY KEY,
    meno VARCHAR,
    type VARCHAR,
    username VARCHAR,
    password VARCHAR,
    log_in_time TIMESTAMP
);

-- Create Tests table
CREATE TABLE IF NOT EXISTS Tests (
    test_id SERIAL PRIMARY KEY,
    cas_na_pisanie TIME
);

-- Create Tasks table
CREATE TABLE IF NOT EXISTS Tasks (
    tasks_id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES Tests(test_id),  -- Changed to reference the test_id column
    task_id INTEGER
);

-- Create Easy_exercises table
CREATE TABLE IF NOT EXISTS Easy_exercises (
    task_id SERIAL PRIMARY KEY,
    difficulty VARCHAR,
    description VARCHAR,
    image BYTEA,  -- Assuming image is stored as bytea (binary data)
    points INTEGER
);

-- Create Medium_exercises table
CREATE TABLE IF NOT EXISTS Medium_exercises (
    task_id SERIAL PRIMARY KEY,
    difficulty VARCHAR,
    description VARCHAR,
    image BYTEA,  -- Assuming image is stored as bytea (binary data)
    points INTEGER
);

-- Create Hard_exercises table
CREATE TABLE IF NOT EXISTS Hard_exercises (
    task_id SERIAL PRIMARY KEY,
    difficulty VARCHAR,
    description VARCHAR,
    image BYTEA,  -- Assuming image is stored as bytea (binary data)
    points INTEGER
);

-- Create Test_Submissions table
CREATE TABLE IF NOT EXISTS Test_Submissions (
    submission_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(user_id),
    test_id INTEGER REFERENCES Tests(test_id),
    timestamp TIMESTAMP
);

-- Create Test_Scores table
CREATE TABLE IF NOT EXISTS Test_Scores (
    score_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(user_id),
    test_id INTEGER REFERENCES Tests(test_id),
    points INTEGER,
    timestamp TIMESTAMP
);

-- Add Foreign Key Constraints
ALTER TABLE Tasks ADD CONSTRAINT fk_tests_id FOREIGN KEY (test_id) REFERENCES Tests(test_id);  -- Fixed the foreign key constraint
ALTER TABLE Tasks ADD CONSTRAINT fk_easy_task_id FOREIGN KEY (task_id) REFERENCES Easy_exercises(task_id);
ALTER TABLE Tasks ADD CONSTRAINT fk_medium_task_id FOREIGN KEY (task_id) REFERENCES Medium_exercises(task_id);
ALTER TABLE Tasks ADD CONSTRAINT fk_hard_task_id FOREIGN KEY (task_id) REFERENCES Hard_exercises(task_id);