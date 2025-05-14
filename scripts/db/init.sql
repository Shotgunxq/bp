-- =========================================
-- 1) USERS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS Users (
    user_id      SERIAL PRIMARY KEY,
    first_name   VARCHAR NOT NULL,
    last_name    VARCHAR NOT NULL,
    email        VARCHAR UNIQUE NOT NULL,
    user_type    VARCHAR
);

-- =========================================
-- 2) THEMES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS Themes (
    theme_id          SERIAL PRIMARY KEY,
    theme_name        VARCHAR UNIQUE NOT NULL,
);

-- =========================================
-- 3) EXERCISES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS Exercises (
    exercise_id      SERIAL PRIMARY KEY,
    theme_id         INTEGER NOT NULL DEFAULT 3 REFERENCES Themes(theme_id) ON DELETE CASCADE,
    difficulty_level VARCHAR NOT NULL,
    description      TEXT,
    points           INTEGER,
    correct_answer   VARCHAR,
    hints            TEXT
);

-- =========================================
-- 4) TESTS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS Tests (
    test_id       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    writing_time  TIME,
    exercises     JSONB
);

-- =========================================
-- 5) TEST_SUBMISSIONS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS Test_Submissions (
    submission_id  SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    test_id        INTEGER NOT NULL REFERENCES Tests(test_id) ON DELETE CASCADE,
    user_answer    TEXT,
    hints_used     INTEGER,
    points_scored  INTEGER,
    submitted_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 6) TEST_SCORES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS Test_Scores (
    score_id       SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    test_id        INTEGER NOT NULL REFERENCES Tests(test_id) ON DELETE CASCADE,
    points_scored  INTEGER
);

-- =========================================
-- SAMPLE DATA INSERT INTO EXERCISES
-- =========================================
-- INSERT INTO Exercises (theme_id, difficulty_level, description, points, correct_answer)
-- VALUES
--     (1, 'easy', 'Ak sú náhodné udalostia P je pravdepodobnosť, potom platí P(A) = P( A ∩ B) + P(A) ∩ BC', 3, 'Pravda'),
--     (1, 'easy', 'Ak A, B sú náhodné udalostia a P je pravdepodobnosť, potom platí P ( A ∩ B ) ≤ P(A) + P(B) – P(A ∪ B)', 3, 'Pravda'),
--     (1, 'easy', 'V jednej krabici je 10 modrých a 5 červených balónov. V druhej krabici je osem bielych a 12 modrých balónov. Náhodne si zvolíme jednu krabicu a vyberieme z neho 1 balón. Aká je pravdepodobnosť, že z nej vytiahnutý balón bude červený?', 3, '3,16'),
--     (1, 'easy', 'V jednej krabici je 10 modrých a 5 červených balónov. V druhej krabici je osem bielych a 12 modrých balónov. Náhodne si zvolíme jednu krabicu a vyberieme z neho I balón. Aká je pravdepodobnosť, že z nej vytiahnutý balón bude biely?', 3, '3,2'),
--     (1, 'easy', 'Vieme že prístupový kód sa skladá, z piatich rôznych znakov z množiny { 1, 2, 3, 4, 5, 6}. Aká je pravdepodobnosť, že na prvý krát uhádneme prístupový kód? Výsledok vyjadrite na 4 desatinné miesta.', 3, '3,0013888'),
--     (1, 'easy', 'V lietadle je 20% cestujúcich zo SR- Je známe, Že 60% obyvaterov SR pije po obede pivo, kým obyvatelia iných štátov vypijú pivo po obede len v 20%. Cestujúci po obede si vypýta pivo. S akou pravdepodobnosťou je to občan SR?', 3, '3,42857'),
--     (1, 'easy', 'V krabici s 20-timi fixkami sa nachádzajú 3 vadné. Vyberieme S. Náhodná premenná X predstavuje počet vadných fixiek. Ako sa rozdelenie pravdepodobnosti náhodnej premennej X?', 3, 'Hypergeometrické'),
--     (1, 'easy', 'Náhodná premenná X ~ Bi(n; p) a vieme, že E(X) = 9 a D(X) = 6,3. Vypocitajte disperziu n.p. Y = 2X -1.', 3, '25,2');




INSERT INTO themes (theme_id, theme_name) VALUES
  (0, 'Uplatnenie kombinatoriky');
  (1, 'Podmienená pravdepodobnosť'),
  (2, 'Náhodná premenná a rozdelenia'),
  (3, 'Teória pravdepodobnosti'),



-- =========================================
-- Tieto ulohy su z MOODLE

-- 1. Kombinatorika

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'medium',
   '\\begin{aligned}
    & \\text{Máme k dispozícii 10 vzoriek označených v1...v10.} \\\\
    & \\text{Náhodne vyberieme 3 vzorky. Aká je pravdepodobnosť, že vyberieme }\\{v1, v3, v6\\}\\text{?}
   \\end{aligned}',
   3, '0.0083', '[Spočítaj C(10,3),Pravdepodobnosť = 1 / C(10,3)., n!/(n-k)!k!]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'easy',
   '\\begin{aligned}
    & \\text{Máme skupinu piatich študentov A=\\{Boris, Elena, Igor, Jana, Táňa\\}.} \\\\
    & \\text{Koľko dvojíc z nich je možné zostaviť?}
   \\end{aligned}',
   2, '10', '[Poradie nezálezí, kombinácie, C(5,2)]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES --TODO
  (0, 'hard',
   '\\begin{aligned}
    & \\text{V urne je 12 loptičiek: 5 označených \"1\", 2 označené \"2\" a 5 označených inak.} \\\\
    & \\text{Aká je pravdepodobnosť, že pri postupnom ťahaní bez vrátenia vytiahneme v poradí }1,2,3\\text{?}
   \\end{aligned}',
   4, '3.6075E-5', '[]');

-- 2. Teória pravdepodobnosti

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (3, 'easy',
   '\\begin{aligned}
    & \\text{Ak A, B sú náhodné udalosti a P je pravdepodobnosť, platí:} \\\\
    & \\text{P(A \\cap B) = P(A) + P(B) - P(A \\cup B)}
   \\end{aligned}',
   2, 'Pravda', '[Rozbor inklúzia/exklklúza, Preusporiadaj rovnosť]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES --TODO
  (3, 'medium',
   '\\begin{aligned}
    & \\text{Nech }\\Omega=\\{1,2,3,4,5,6\\}. \\text{Ktoré zo systémov podmnožín tvorí algebru?} \\\\
    & \\text{S1 = \\{\\emptyset,\\Omega\\}, S2 = \\{\\emptyset,\\{1\\},\\{2,3,4,5,6\\},\\Omega\\}, …}
   \\end{aligned}',
   3, 'S1, S4', '[Skontroluj prázdnu množinu a Omegu v systéme., Skontroluj uzáver k doplnkám aj zjednoteniam.]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES --TODO
  (3, 'medium',
   '\\begin{aligned}
    & \\text{Prístupový kód: 5 rôznych znakov z \\{1,2,3,4,5,6\\}.} \\\\
    & \\text{Aká je pravdepodobnosť, že ho uhádneme na prvýkrát?}
   \\end{aligned}',
   3, '0.0013888', '[]');

-- 3. Podmienená pravdepodobnosť -- DONE

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (2, 'medium',
   '\\begin{aligned}
    & \\text{Dva závody vyrábajú okenné rámy: 45\\% a 55\\% produkcie.} \\\\
    & \\text{Prvý: 90\\% I. kategórie, druhý: 95\\% I. kategórie.} \\\\
    & \\text{Aká je pravdepodobnosť, že náhodne vybraný rám je I. kategórie?}
   \\end{aligned}',
   3, '0.9275', '[Najprv vypočítaj príspevok prvého závodu k I. kategórii ako 0.45 * 0.90.,
   Potom vypočítaj príspevok druhého závodu k I. kategórii ako 0.55 * 0.95.,
   Spočítaj tieto dva príspevky, aby si dostal celkovú pravdepodobnosť I. kategórie.,]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (2, 'medium',
   '\\begin{aligned}
    & \\text{V lietadle je 20\\% cestujúcich zo SR. 60\\% SR pije pivo, 20\\% cudzinci.} \\\\
    & \\text{Cestujúci si vypýtal pivo. Aká je pravdepodobnosť, že je to občan SR?}
   \\end{aligned}',
   3, '0.42857', '[Najprv vypočítaj, akú časť všetkých cestujúcich predstavujú Slováci, ktorí pijú pivo: 0.20 * 0.60.,
   Potom zistite, akú časť všetkých cestujúcich tvoria cudzinci, ktorí pijú pivo: 0.80 * 0.20.,
   Spočítaj tieto dve hodnoty, aby si dostal celkovú pravdepodobnosť, že niekto pýta pivo.,
   Nakoniec vydel prienik Slovák–pivo celkovou pravdepodobnosťou piva, aby si dostal P(SR|PIVO).
   ]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (2, 'easy',
   '\\begin{aligned}
    & \\text{V ročníku 100 študentov má 10 mien Jozef.} \\\\
    & \\text{Aká je pravdepodobnosť, že náhodne vybraný študent sa volá Jozef?}
   \\end{aligned}',
   2, '0.1', '[Vyjadri pravdepodobnosť ako pomer počtu Jozefov k celkovému počtu študentov: 10/100]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (2, 'easy',
   '\\begin{aligned}
    & \\text{Krabica 1: 10 modrých, 5 červených balónov.} \\\\
    & \\text{Krabica 2: 8 bielych, 12 modrých balónov.} \\\\
    & \\text{Náhodne vyberieme krabicu a balón. Aká je pravdepodobnosť červeného?}
   \\end{aligned}',
   2, '0.1667', '[ Pre krabicu 1 spočítaj pravdepodobnosť červeného balónu: 1/2 * 5/(10+5).,
    Pre krabicu 2 spočítaj pravdepodobnosť červeného balónu: 1/2 * 0/8+12.,
    Oba výsledky spočítaj dokopy.
   ]');

-- 4. Náhodná premenná a rozdelenia

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (3, 'medium',
   '\\begin{aligned}
    & \\text{Rozdelenie X: }t=2,3,4,5,6; P(X=t)=0.1,0.3,0.3,0.2,0.1. \\\\
    & \\text{Vypočítajte strednú hodnotu }E(X).
   \\end{aligned}',
   3, '3.9', '[Vynásob každú hodnotu t jej pravdepodobnosťou., Sčítaj tieto súčiny.]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (3, 'medium',
   '\\begin{aligned}
    & \\text{Hádžeme štyrmi kockami. Náhodná premenná X = minimum z hodov.} \\\\
    & \\text{Koľko výsledkov má množina \\{\\omega: X=2\\}?}
   \\end{aligned}',
   3, '369', '[Pre X=2 platí, že v hodoch nie je žiadna 1 a aspoň jeden hod je 2.,
   Počet sekvencií bez 1 je 5^4, bez 1 aj 2 je 4^4.,
   Výsledok je rozdiel týchto dvoch hodnôot.
]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES --TODO
  (3, 'hard',
   '\\begin{aligned}
    & \\text{Hádžeme piatimi kockami. X = maximum z hodov.} \\\\
    & \\text{Vypočítajte }P(X<3)\\text{ a }E(X).
   \\end{aligned}',
   4, 'P(X<3)=0.9688; E(X)=4.67', '[]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (3, 'hard',
   '\\begin{aligned}
    & \\text{Náhodná premenná }X\\sim\\mathrm{Bi}(n=9,p=0.7). \\\\
    & \\text{Vypočítajte }D(2X-1)\\text{, ak }E(X)=6.3, D(X)=1.89.
   \\end{aligned}',
   4, '25.2', '[]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (3, 'medium',
   '\\begin{aligned}
    & \\text{Nech }X\\sim N(4,1). \\text{Nájdite }a\\text{ tak, že }P(2X+1\\le a)=0.9.
   \\end{aligned}',
   3, '11.5621', '[]');


-- =========================================
-- Ulohy od Volauf
-- kombinatorika
INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  -- a) na druhej minci padne znak
  (0, 'easy',
    '\\begin{aligned}
     &\\text{Náhodný pokus spočíva v hode štyrmi riadnymi, ale označenými mincami.}\\\\
     &\\text{Určte pravdepodobnosť, že na druhej minci padne znak.}
     \\end{aligned}',
    1, '1/2', NULL),

  -- b) znak padne len na druhej minci
  (0, 'easy',
    '\\begin{aligned}
     &\\text{Náhodný pokus spočíva v hode štyrmi riadnymi, ale označenými mincami.}\\\\
     &\\text{Určte pravdepodobnosť, že znak padne len na druhej minci.}
     \\end{aligned}',
    1, '1/16', NULL),

  -- c) na prvej a na tretej minci padne znak
  (0, 'easy',
    '\\begin{aligned}
     &\\text{Náhodný pokus spočíva v hode štyrmi riadnymi, ale označenými mincami.}\\\\
     &\\text{Určte pravdepodobnosť, že na prvej a na tretej minci padne znak.}
     \\end{aligned}',
    1, '1/4', NULL),

  -- d) znak padne len na prvej a tretej minci
  (0, 'easy',
    '\\begin{aligned}
     &\\text{Náhodný pokus spočíva v hode štyrmi riadnymi, ale označenými mincami.}\\\\
     &\\text{Určte pravdepodobnosť, že znak padne len na prvej a tretej minci.}
     \\end{aligned}',
    1, '1/16', NULL),

  -- e) padnú práve dva znaky
  (0, 'easy',
    '\\begin{aligned}
     &\\text{Náhodný pokus spočíva v hode štyrmi riadnymi, ale označenými mincami.}\\\\
     &\\text{Určte pravdepodobnosť, že padnú práve dva znaky.}
     \\end{aligned}',
    1, '6/16', NULL);

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  -- a) čísla na vytiahnutých lístkoch sa líšia o viac ako 2
  (0, 'medium',
   '\begin{aligned}
     &\text{V škatuli je 9 lístkov očíslovaných číslami }1,2,3,\dots,9.\\
     &\text{Náhodne vyberieme naraz dva lístky.}\\
     &\text{Aká je pravdepodobnosť, že čísla na vytiahnutých lístkoch}\\
     &\quad\text{sa líšia o viac ako 2?}
   \end{aligned}',
   3,
   '7/12',
   NULL
  ),
  -- b) súčet čísel na vytiahnutých lístkoch je aspoň 7
  (0, 'medium',
   '\begin{aligned}
     &\text{V škatuli je 9 lístkov očíslovaných číslami }1,2,3,\dots,9.\\
     &\text{Náhodne vyberieme naraz dva lístky.}\\
     &\text{Aká je pravdepodobnosť, že súčet čísel na vytiahnutých lístkoch}\\
     &\quad\text{je aspoň 7?}
   \end{aligned}',
   3,
   '5/6',
   NULL
  ),
  -- c) súčet čísel na vytiahnutých lístkoch je aspoň 9
  (0, 'medium',
   '\begin{aligned}
     &\text{V škatuli je 9 lístkov očíslovaných číslami }1,2,3,\dots,9.\\
     &\text{Náhodne vyberieme naraz dva lístky.}\\
     &\text{Aká je pravdepodobnosť, že súčet čísel na vytiahnutých lístkoch}\\
     &\quad\text{je aspoň 9?}
   \end{aligned}',
   3,
   '3/4',
   NULL
  );

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  -- a) nie je nepodarak?
  (0, 'medium',
   '\begin{aligned}
     &\text{V škatuli máme 100 výrobkov a medzi nimi 10 nepodarok.}\\
     &\text{Náhodne vyberieme 20 (bez vrátenia) a zistíme, že medzi}\\
     &\quad\text{vybranými je jeden nepodarok. S akou pravdepodobnosťou}\\
     &\quad\text{medzi ďalšími desiatimi náhodne vybranými (opäť bez vrátenia)}\\
     &\quad\text{nie je nepodarok?}
   \end{aligned}',
   3,
   '0.280437',
   NULL
  ),
  -- b) je jeden nepodarok?
  (0, 'medium',
   '\begin{aligned}
     &\text{V škatuli máme 100 výrobkov a medzi nimi 10 nepodarok.}\\
     &\text{Náhodne vyberieme 20 (bez vrátenia) a zistíme, že medzi}\\
     &\quad\text{vybranými je jeden nepodarok. S akou pravdepodobnosťou}\\
     &\quad\text{medzi ďalšími desiatimi náhodne vybranými (opäť bez vrátenia)}\\
     &\quad\text{je práve jeden nepodarok?}
   \end{aligned}',
   3,
   '0.407087',
   NULL
  ),
  -- c) sú dva nepodarky?
  (0, 'medium',
   '\begin{aligned}
     &\text{V škatuli máme 100 výrobkov a medzi nimi 10 nepodarok.}\\
     &\text{Náhodne vyberieme 20 (bez vrátenia) a zistíme, že medzi}\\
     &\quad\text{vybranými je jeden nepodarok. S akou pravdepodobnosťou}\\
     &\quad\text{medzi ďalšími desiatimi náhodne vybranými (opäť bez vrátenia)}\\
     &\quad\text{budú dva nepodarky?}
   \end{aligned}',
   3,
   '0.232621',
   NULL
  ),
  -- d) sú najviac dva nepodarky?
  (0, 'medium',
   '\begin{aligned}
     &\text{V škatuli máme 100 výrobkov a medzi nimi 10 nepodarok.}\\
     &\text{Náhodne vyberieme 20 (bez vrátenia) a zistíme, že medzi}\\
     &\quad\text{vybranými je jeden nepodarok. S akou pravdepodobnosťou}\\
     &\quad\text{medzi ďalšími desiatimi náhodne vybranými (opäť bez vrátenia)}\\
     &\quad\text{budú najviac dva nepodarky?}
   \end{aligned}',
   3,
   '0.920145',
   NULL
  );

-- =========================================
-- podmienena pravdepodobnost

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  -- 1.5.7 a) Aká je nepodarkovosť celej produkcie?
  (1, 'easy',
   '\begin{aligned}
    &\text{Produkcia je tvorená tromi automatickými linkami, ktoré sa}\\
    &\text{podelia na celkovej produkcii (po rade) 50\%, 30\%, resp.\ 20\%.}\\
    &\text{Nepodarkovosť jednotlivých liniek je rovná (po rade) 2\%, 3\%, resp.\ 4\%.}\\
    &\text{Aká je nepodarkovosť celej produkcie?}
   \end{aligned}',
   3,
   '0.027',
   NULL
  ),
  -- 1.5.7 b) P(linka 3 | nepodarok)
  (1, 'medium',
   '\begin{aligned}
    &\text{Produkcia je tvorená tromi automatickými linkami, ktoré sa}\\
    &\text{podelia na celkovej produkcii (po rade) 50\%, 30\%, resp.\ 20\%.}\\
    &\text{Nepodarkovosť jednotlivých liniek je rovná (po rade) 2\%, 3\%, resp.\ 4\%.}\\
    &\text{Nech náhodne vybraný výrobok je nepodarok. Aká je pravdepodobnosť,}\\
    &\text{že bol vyrobený treťou linkou?}
   \end{aligned}',
   3,
   '0.2963',
   NULL
  );

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  -- 1.5.8 a) Pravdepodobnosť správnej odpovede
  (1, 'medium',
   '\begin{aligned}
    &\text{Študent odpovedá formou testu, v ktorom ku každej otázke má ponúknutých 7 alternatívnych odpovedí.}\\
    &\text{Ak má danú otázku naštudovanú, vyberá s istotou správnu odpoveď.}\\
    &\text{V opačnom prípade náhodne volí jednu z ponúkaných odpovedí.}\\
    &\text{Predpokladajme, že pravdepodobnosť uhádnutia správnej odpovede je 1/7.}\\
    &\text{Nakoniec predpokladajme, že študent naštudoval 70\% určenej látky.}\\
    &\text{Aká je pravdepodobnosť, že na náhodne zvolenej otázke študent odpovie správne?}
   \end{aligned}',
   3,
   '52/70',
   NULL
  ),
  -- 1.5.8 b) Pravdepodobnosť, že správna odpoveď nebola hádaná
  (1, 'medium',
   '\begin{aligned}
    &\text{Študent odpovedá formou testu, v ktorom ku každej otázke má ponúknutých 7 alternatívnych odpovedí.}\\
    &\text{Ak má danú otázku naštudovanú, vyberá s istotou správnu odpoveď.}\\
    &\text{V opačnom prípade náhodne volí jednu z ponúkaných odpovedí.}\\
    &\text{Predpokladajme, že pravdepodobnosť uhádnutia správnej odpovede je 1/7.}\\
    &\text{Nakoniec predpokladajme, že študent naštudoval 70\% určenej látky.}\\
    &\text{Ak študent dal správnu odpoveď, s akou pravdepodobnosťou nehádal?}
   \end{aligned}',
   3,
   '49/52',
   NULL
  );

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  -- 1.5.10 a) Pravdepodobnosť, že zariadenie hlási zmenu
  (1, 'medium',
   '\begin{aligned}
    &\text{Diagnostické zariadenie registruje zmenu vo výrobnom procese – ak o zmene}\\
    &\text{skutočne ide – s pravdepodobnosťou 0.99. Na druhej strane hlási zmenu}\\
    &\text{s pravdepodobnosťou 0.05 aj v prípadoch, keď k zmene v skutočnosti nedôjde.}\\
    &\text{Predpokladajme, že pravdepodobnosť zmien vo výrobnom procese je 0.05.}\\
    &\text{Aká je pravdepodobnosť toho, že zariadenie hlási zmenu?}
   \end{aligned}',
   3,
   '0.097',
   NULL
  ),
  -- 1.5.10 b) Pravdepodobnosť, že pri hlásení zmeny skutočne došlo k zmene
  (1, 'medium',
   '\begin{aligned}
    &\text{Diagnostické zariadenie registruje zmenu vo výrobnom procese – ak o zmene}\\
    &\text{skutočne ide – s pravdepodobnosťou 0.99. Na druhej strane hlási zmenu}\\
    &\text{s pravdepodobnosťou 0.05 aj v prípadoch, keď k zmene v skutočnosti nedôjde.}\\
    &\text{Predpokladajme, že pravdepodobnosť zmien vo výrobnom procese je 0.05.}\\
    &\text{Predpokladajme, že zariadenie hlási zmenu. S akou pravdepodobnosťou}\\
    &\text{ide skutočne o zmenu vo výrobnom procese?}
   \end{aligned}',
   3,
   '0.510',
   NULL
  );



-- =========================================
-- Ulohy od Nanasiovej

--Teoria pravdepodobnosti

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
(3, 'easy',
 '\\begin{aligned}
 &\\text{Nech množina }A=\\{1,2,3\\}\\text{ a }\\Omega\\text{ je množina všetkých}\\
 &\\text{trojciferných čísel tvorených prvkami }A.\\\\
 &\\text{Koľko prvkov má množina }\\Omega?
 \\end{aligned}',
 '3', '27', NULL);

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
(3, 'easy',
 '\\begin{aligned}
 &\\text{Nech množina }A=\\{1,2,3\\}\\text{ a }\\Omega_1\\text{ je množina}\\
 &\\text{trojciferných čísel z }A,\\text{ v ktorých sa každé číslo môže}\\
 &\\text{použiť iba raz.}\\\\
 &\\text{Koľko prvkov má množina }\\Omega_1?
 \\end{aligned}',
 '3', '6', NULL);

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
(3, 'easy',
 '\\begin{aligned}
 &\\text{Nech množina }A=\\{1,2,3\\}\\text{ a }\\Omega_2\\text{ je množina}\\
 &\\text{trojciferných čísel z }A,\\text{ v ktorých čísla 2 a 3}\\
 &\\text{sa môžu použiť iba raz (1 môže byť opakovane).}\\\\
 &\\text{Koľko prvkov má množina }\\Omega_2?
 \\end{aligned}',
 '3', '13', NULL);

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
(3, 'easy',
 '\\begin{aligned}
 &\\text{Máme udalosti }A\\text{ a }B\\text{. Nech }P(A)=0{,}3,\\;P(B)=0{,}6\\\\
 &\\text{a nech }0 \\le P(A\\cap B) \\le 0{,}5.\\\\
 &\\text{Môžu byť }A,B\\text{ navzájom nezávislé?}
 \\end{aligned}',
 '2', 'Áno', NULL);

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
(3, 'easy',
 '\\begin{aligned}
 &\\text{V urne je 10 loptíčok, z ktorých 5 má označenie 1 a zvyšné}\\
 &\\text{majú označenia }2,3,4,5,6.\\
 &\\text{Ťaháme postupne po jednej loptíčke bez vrátenia,}\\
 &\\text{opakujeme, kým urna nie je prázdna.}\\
 &\\text{Aká je pravdepodobnosť, že ich vytiahneme v poradí}\\
 &1,3,2,4,5,6,1,1,1,1?
 \\end{aligned}',
 '1', '1/30240', NULL),
(3, 'easy',
 '\\begin{aligned}
 &\\text{V urne je 12 loptíčok označených }1,2,3,\\text{ tak, že 5 z nich}\\
 &\\text{je označených }1, 4\\text{ je označených }2\\text{ a zvyšné }3.\\
 &\\text{Ťaháme postupne po jednej loptíčke bez vrátenia,}\\
 &\\text{opakujeme, kým urna nie je prázdna.}\\
 &\\text{Aká je pravdepodobnosť, že ich vytiahneme v poradí}\\
 &1,2,2,2,3,1,1,1,1,3,3?
 \\end{aligned}',
 '1', '1/27720', NULL),
(3, 'easy',
 '\\begin{aligned}
 &\\text{V urne je 12 loptíčok označených }1,2,3,\\text{ tak, že 5 z nich}\\
 &\\text{je označených }1, 4\\text{ je označených }2\\text{ a zvyšné }3.\\
 &\\text{Ťaháme postupne po jednej loptíčke bez vrátenia,}\\
 &\\text{opakujeme 4-krát.}\\
 &\\text{Aká je pravdepodobnosť, že všetky budú označené }1?
 \\end{aligned}',
 '1', '5/495', NULL);



 -- =========================================
-- Nahodna premenna a rozdelenia

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
(2, 'easy',
 '\\begin{aligned}
 &\\text{Je známe, že 25\\% obyvateľstva sú ľaváci.}\\
 &\\text{Na seminári s 30 účastníkmi.}\\
 &\\text{Aká je pravdepodobnosť, že najviac traja sú ľaváci?}
 \\end{aligned}',
 '1', '0.03745', NULL);