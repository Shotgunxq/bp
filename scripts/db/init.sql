-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,  -- Unique, non-null email field
    user_type VARCHAR
);

-- Create Tests table
CREATE TABLE IF NOT EXISTS Tests (
    test_id SERIAL PRIMARY KEY,
    writing_time TIME,
    exercises JSONB  -- JSONB column to store full exercise data for the test
);

-- Create Themes table
CREATE TABLE IF NOT EXISTS Themes (
    theme_id SERIAL PRIMARY KEY,
    theme_name VARCHAR UNIQUE NOT NULL,  -- Unique theme name
    theme_description TEXT
);

-- Create Exercises table
CREATE TABLE IF NOT EXISTS Exercises (
    exercise_id SERIAL PRIMARY KEY,
    theme_id INTEGER NOT NULL DEFAULT 0 REFERENCES Themes(theme_id) ON DELETE CASCADE,
    difficulty_level VARCHAR NOT NULL,  -- Descriptive levels like 'easy', 'medium', 'hard'
    description TEXT,
    image BYTEA,  -- Store image as binary data
    points INTEGER,
    correct_answer VARCHAR
);

-- Create Test_Submissions table
CREATE TABLE IF NOT EXISTS Test_Submissions (
    submission_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    test_id INTEGER NOT NULL REFERENCES Tests(test_id) ON DELETE CASCADE,
    points_scored INTEGER,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Test_Scores table
CREATE TABLE IF NOT EXISTS Test_Scores (
    score_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    test_id INTEGER NOT NULL REFERENCES Tests(test_id) ON DELETE CASCADE,
    points_scored INTEGER,
);


INSERT INTO Exercises (theme_id, difficulty_level, description, image, points, correct_answer) VALUES
    (1, 'easy', 'Ak sú náhodné udalostia P je pravdepodobnosť, potom platí P(A) = P( A ∩ B) + P(A ∩ BC)', NULL, 0, 'Pravda'),
    (1, 'easy', 'Ak A, B sú náhodné udalostia a P je pravdepodobnosť, potom platí P ( A ∩ B ) ≤ P(A) + P(B) – P(A ∪ B)', NULL, 0, 'Pravda'),
    (1, 'easy', 'V jednej krabici je 10 modrých a 5 červených balónov. V druhej krabici je osem bielych a 12 modrých balónov. Náhodne si zvolíme jednu krabicu a vyberieme z neho 1 balón. Aká je pravdepodobnosť, že z nej vytiahnutý balón bude červený?', NULL, 0, '0,16'),
    (1, 'easy', 'V jednej krabici je 10 modrých a 5 červených balónov. V druhej krabici je osem bielych a 12 modrých balónov. Náhodne si zvolíme jednu krabicu a vyberieme z neho I balón. Aká je pravdepodobnosť, že z nej vytiahnutý balón bude biely?', NULL, 0, '0,2'),
    (1, 'easy', 'Vieme že prístupový kód sa skladá, z piatich rôznych znakov z množiny { 1, 2, 3, 4, 5, 6}. Aká je pravdepodobnosť, že na prvý krát uhádneme prístupový kód? Výsledok vyjadrite na 4 desatinné miesta.', NULL, 0, '0,0013888'),
    (1, 'easy', 'V lietadle je 20% cestujúcich zo SR- Je známe, Že 60% obyvaterov SR pije po obede pivo, kým obyvatelia iných štátov vypijú pivo po obede len v 20%. Cestujúci po obede si vypýta pivo. S akou pravdepodobnosťou je to občan SR?', NULL, 0, '0,42857'),
    (1, 'easy', 'V krabici s 20-timi fixkami sa nachádzajú 3 vadné. Vyberieme S. Náhodná premenná X predstavuje počet vadných fixiek. Ako sa rozdelenie pravdepodobnosti náhodnej premennej X?', NULL, 0, 'Hypergeometrické'),
    (1, 'easy', 'Náhodná premenná X ~ Bi(n; p) a vieme, že E(X) = 9 a D(X) = 6,3. Vypocitajte disperziu n.p. Y = 2X -1.', NULL, 0, '25,2');
