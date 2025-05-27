-- =========================================
-- 1) USERS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS users (
    user_id      SERIAL    PRIMARY KEY,
    first_name   VARCHAR   NOT NULL,
    last_name    VARCHAR   NOT NULL,
    email        VARCHAR   UNIQUE NOT NULL,
    user_type    VARCHAR
);

-- =========================================
-- 2) THEMES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS themes (
    theme_id     SERIAL    PRIMARY KEY,
    theme_name   VARCHAR   UNIQUE NOT NULL
);

-- =========================================
-- 3) EXERCISES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS exercises (
    exercise_id      SERIAL    PRIMARY KEY,
    theme_id         INTEGER   NOT NULL 
                             REFERENCES themes(theme_id)
                             ON DELETE CASCADE,
    difficulty_level VARCHAR   NOT NULL,
    description      TEXT,
    points           INTEGER,
    correct_answer   VARCHAR,
    hints            JSONB
);

-- =========================================
-- 4) TESTS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS tests (
    test_id       INT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    writing_time  TIME,
    exercises     JSONB
);

-- =========================================
-- 5) TEST_SUBMISSIONS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS test_submissions (
    submission_id  SERIAL    PRIMARY KEY,
    user_id        INTEGER   NOT NULL 
                             REFERENCES users(user_id)
                             ON DELETE CASCADE,
    test_id        INTEGER   NOT NULL 
                             REFERENCES tests(test_id)
                             ON DELETE CASCADE,
    total_score    INTEGER,
    total_hints    JSONB,
    answers        JSONB,
    submitted_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  (0, 'Uplatnenie kombinatoriky'),
  (1, 'Podmienená pravdepodobnosť'),
  (2, 'Náhodná premenná a rozdelenia'),
  (3, 'Teória pravdepodobnosti');




INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'medium',
   '\begin{aligned}
    & \text{Máme k dispozícii 10 vzoriek označených v1...v10.} \\
    & \text{Náhodne vyberieme 3 vzorky. Aká je pravdepodobnosť, že vyberieme }\{v1, v3, v6\}\text{?} \\
    & \textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na štyri desatinné miesta.}
   \end{aligned}',
   3, '0.0083', '["Spočítaj C(10,3)" , "Pravdepodobnosť = 1 / C(10,3).", "n!/(n-k)!k!"]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'easy',
   '\begin{aligned}
    & \text{Máme skupinu piatich študentov A=\{Boris, Elena, Igor, Jana, Táňa\}.} \\
    & \text{Koľko dvojíc z nich je možné zostaviť?}
   \end{aligned}',
   2, '10', '["Poradie nezálezí", "kombinácie, C(5,2)"]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'hard',
   '\begin{aligned}
    & \text{V urne je 12 loptičiek: 5 označených "1", 2 označené "2" a 5 označených inak.} \\
    & \text{Aká je pravdepodobnosť, že pri postupnom ťahaní bez vrátenia vytiahneme v poradí }1,2,3\text{?}
    & \textbf{Odpoveď zapíšte ako zlomok.}
   \end{aligned}',
   4, '5/132', '["Loptičiek s číslom 1 je 5, s číslom 2 sú 2, a zvyšných 5 je iných.", "Pravdepodobnosť, že prvá loptička je '1' = 5/12, druhá je '2' = 2/11, a tretia je iná (už len z tých 5 iných) = 5/10.", "Výslednú pravdepodobnosť získaš vynásobením týchto troch zlomkov."]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (3, 'easy',
   '\begin{aligned}
    & \text{Ak A, B sú náhodné udalosti a P je pravdepodobnosť, platí:} \\
    & P(A \cap B) = P(A) + P(B) - P(A \cup B) \\
    & \textbf{Odpoveď: pravda / nepravda}
   \end{aligned}',
   2, 'pravda', '["Rozbor inklúzia/exklklúza", "Preusporiadaj rovnosť"]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (3, 'medium',
   '\begin{aligned}
    & \text{Nech }\Omega=\{1,2,3,4,5,6\}. \text{Ktoré zo systémov podmnožín tvorí algebru?} \\
    & S1 = \{\emptyset,\Omega\}, S2 = \{\emptyset,\{1\},\{2,3,4,5,6\},\Omega\}, ...
   \end{aligned}',
   3, 'S1, S4', '["Skontroluj prázdnu množinu a Omegu v systéme.", "Skontroluj uzáver k doplnkám aj zjednoteniam."]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (3, 'medium',
   '\begin{aligned}
    & \text{Prístupový kód: 5 rôznych znakov z \{1,2,3,4,5,6\}.} \\
    & \text{Aká je pravdepodobnosť, že ho uhádneme na prvýkrát?}
    &\textbf{Odpoveď zapíšte ako zlomok.}
   \end{aligned}',
   3, '1/720', '["Prístupový kód je tvorený z 5 rôznych znakov, teda záleží na poradí – ide o variácie bez opakovania.", "Spočítaj počet všetkých možných kódov: V(6,5) = 6 × 5 × 4 × 3 × 2 = 720.", "Len jeden z týchto kódov je správny, takže pravdepodobnosť uhádnutia je 1/720."]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (2, 'medium',
   '\begin{aligned}
    & \text{Dva závody vyrábajú okenné rámy: 45% a 55% produkcie.} \\
    & \text{Prvý: 90% I. kategórie, druhý: 95% I. kategórie.} \\
    & \text{Aká je pravdepodobnosť, že náhodne vybraný rám je I. kategórie?} \\
    & \textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na štyri desatinné miesta.}
   \end{aligned}',
   3, '0.9275', '["Najprv vypočítaj príspevok prvého závodu k I. kategórii ako 0.45 * 0.90.",
   "Potom vypočítaj príspevok druhého závodu k I. kategórii ako 0.55 * 0.95.",
   "Spočítaj tieto dva príspevky, aby si dostal celkovú pravdepodobnosť I. kategórie."]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (2, 'medium',
   '\begin{aligned}
    & \text{V lietadle je 20% cestujúcich zo SR. 60% SR pije pivo, 20% cudzinci.} \\
    & \text{Cestujúci si vypýtal pivo. Aká je pravdepodobnosť, že je to občan SR?} \\
    & \textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na päť desatinné miesta.}
   \end{aligned}',
   3, '0.42857', '["Najprv vypočítaj, akú časť všetkých cestujúcich predstavujú Slováci, ktorí pijú pivo: 0.20 * 0.60.",
   "Potom zistite, akú časť všetkých cestujúcich tvoria cudzinci, ktorí pijú pivo: 0.80 * 0.20.",
   "Spočítaj tieto dve hodnoty, aby si dostal celkovú pravdepodobnosť, že niekto pýta pivo.",
   "Nakoniec vydel prienik Slovák-pivo celkovou pravdepodobnosťou piva, aby si dostal P(SR|PIVO)."
   ]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (2, 'easy',
   '\begin{aligned}
    & \text{V ročníku 100 študentov má 10 mien Jozef.} \\
    & \text{Aká je pravdepodobnosť, že náhodne vybraný študent sa volá Jozef?} \\
    & \textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na jedno desatinné miesto.}
   \end{aligned}',
   2, '0.1', '["Vyjadri pravdepodobnosť ako pomer počtu Jozefov k celkovému počtu študentov: 10/100"]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (2, 'easy',
   '\begin{aligned}
    & \text{Krabica 1: 10 modrých, 5 červených balónov.} \\
    & \text{Krabica 2: 8 bielych, 12 modrých balónov.} \\
    & \text{Náhodne vyberieme krabicu a balón. Aká je pravdepodobnosť červeného?} \\
    & \textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na štyri desatinné miesta.}
   \end{aligned}',
   2, '0.1667', '["Pre krabicu 1 spočítaj pravdepodobnosť červeného balónu: 1/2 * 5/(10+5).",
    "Pre krabicu 2 spočítaj pravdepodobnosť červeného balónu: 1/2 * 0/8+12.",
    "Oba výsledky spočítaj dokopy."
   ]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (3, 'medium',
   '\begin{aligned}
    & \text{Rozdelenie X: }t=2,3,4,5,6; P(X=t)=0.1,0.3,0.3,0.2,0.1. \\
    & \text{Vypočítajte strednú hodnotu }E(X). \\
    & \textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na jedno desatinné miesto.}
   \end{aligned}',
   3, '3.9', '["Vynásob každú hodnotu t jej pravdepodobnosťou.", "Sčítaj tieto súčiny."]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (3, 'medium',
   '\begin{aligned}
    & \text{Hádžeme štyrmi kockami. Náhodná premenná X = minimum z hodov.} \\
    & \text{Koľko výsledkov má množina} \{\omega: X=2\}?
   \end{aligned}',
   3, '369', '["Pre X=2 platí, že v hodoch nie je žiadna 1 a aspoň jeden hod je 2.",
   "Počet sekvencií bez 1 je 5^4, bez 1 aj 2 je 4^4.",
   "Výsledok je rozdiel týchto dvoch hodnôot."
]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (3, 'hard',
   '\begin{aligned}
    & \text{Hádžeme piatimi kockami. X = maximum z hodov.} \\
    & \text{Vypočítajte }P(X<3)\text{ a }E(X).
    & \textbf{Odpoveď zapíš ako dve desatinné čísla oddelené bodkočiarkou, v poradí: pravdepodobnosť; stredná hodnota. Priklad: 0.0082; 1.3223}
   \end{aligned}',
   4, 'P(X<3)=0.9688; E(X)=4.67', '["Pre P(X<3) musia všetky kocky padnúť len ako 1 alebo 2, teda pravdepodobnosť je (2/6)^5.", "Na E(X) použi: P(X=k)=P(X≤k)−P(X≤k−1), potom spočítaj ∑k⋅P(X=k).", "Výsledok zaokrúhli na 4 desatinné miesta a zapíš v tvare: pravdepodobnosť; stredná hodnota."]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (3, 'hard',
   '\begin{aligned}
    & \text{Náhodná premenná }X\sim\mathrm{Bi}(n=9,p=0.7). \\
    & \text{Vypočítajte }D(2X-1)\text{, ak }E(X)=6.3, D(X)=1.89. \\
    & \textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na jedno desatinné miesto.}
   \end{aligned}',
   4, '25.2', '["Skontroluj, akú hodnotu rozptylu D(X) uvádza zadanie - je to 6,3",
   "Pripomeň si, že pre lineárnu transformáciu Y = aX + b platí D(Y) = a^2 * D(X).",
   "Tu je a=2 takže D(2X - 1) = 2^2 * 6.3 = 4 * 6.3 = 25.2."
   ]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (3, 'medium',
   '\begin{aligned}
    & \text{Nech }X\sim N(4,1). \text{Nájdite }a\text{ tak, že }P(2X+1\le a)=0.9. \\
    & \textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na štyri desatinné miesta.}
   \end{aligned}',
   3, '11.5621', '["Najprv preveď udalosť 2X + 1 <= a na udalosť X <= (a-1)/2.",
   "Potom zisti pri akej hodnote x má X ∼ N(4,1) pravdepodobnosť 0.9.",
   "Nakoniec vyjadri a = 2(4 + 1.2816) + 1 = 11.5621."
   ]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'easy',
    '\begin{aligned}
     &\text{Náhodný pokus spočíva v hode štyrmi riadnymi, ale označenými mincami.}\\
     &\text{Určte pravdepodobnosť, že na druhej minci padne znak.}  \\
    &\textbf{Odpoveď zapíšte ako zlomok.}
     \end{aligned}',
    1, '1/2', '[
  "Uvedom si, že každý hod mincou je nezávislý od ostatných.",
  "Pravdepodobnosť, že konkrétna (druhá) minca padne na znak, je 1/2.",
  "Ostatné hody (prvá, tretia, štvrtá) neovplyvňujú výsledok druhej mince."
]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'easy', 
    '\begin{aligned}
     &\text{Náhodný pokus spočíva v hode štyrmi riadnymi, ale označenými mincami.}\\
     &\text{Určte pravdepodobnosť, že znak padne len na druhej minci.}  \\
    &\textbf{Odpoveď zapíšte ako zlomok.}
     \end{aligned}',
    1, '1/16', '["Každá minca má pravdepodobnosť 1/2 na znak aj orla.", "Potrebujeme, aby druhá minca padla na znak a ostatné tri na orla.", "Celková pravdepodobnosť je (1/2)^4 = 1/16."]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'easy',
    '\begin{aligned}
     &\text{Náhodný pokus spočíva v hode štyrmi riadnymi, ale označenými mincami.}\\
     &\text{Určte pravdepodobnosť, že na prvej a na tretej minci padne znak.} \\
    &\textbf{Odpoveď zapíšte ako zlomok.}
     \end{aligned}',
    1, '1/4', '["Každá minca má pravdepodobnosť 1/2 na znak aj orla.", "Potrebujeme, aby prvá a tretia minca padli na znak - ostatné môžu padnúť akokoľvek.", "Výsledná pravdepodobnosť je (1/2)·(1/2) = 1/4."]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'easy',
    '\begin{aligned}
     &\text{Náhodný pokus spočíva v hode štyrmi riadnymi, ale označenými mincami.}\\
     &\text{Určte pravdepodobnosť, že znak padne len na prvej a tretej minci.} \\
    &\textbf{Odpoveď zapíšte ako zlomok.}
     \end{aligned}',
    1, '1/16', '["Každá minca padne na znak s pravdepodobnosťou 1/2.", "Potrebujeme, aby prvá a tretia padli na znak a druhá a štvrtá na opačnú stranu.", "Vynásob všetky štyri pravdepodobnosti: (1/2)^4 = 1/16."]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'easy',
    '\begin{aligned}
     &\text{Náhodný pokus spočíva v hode štyrmi riadnymi, ale označenými mincami.}\\
     &\text{Určte pravdepodobnosť, že padnú práve dva znaky.} \\
    &\textbf{Odpoveď zapíšte ako zlomok.}
     \end{aligned}',
    1, '6/16', '["Zisti, koľko rôznych spôsobov môže padnúť práve 2 znaky zo 4 hodov.", "Počet takýchto možností je kombinácia: C(4,2) = 6.", "Každá z týchto možností má pravdepodobnosť (1/2)^4 = 1/16, takže celková pravdepodobnosť je 6·(1/16) = 6/16."]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'medium',
   '\begin{aligned}
     &\text{V škatuli je 9 lístkov očíslovaných číslami }1,2,3,\dots,9.\\
     &\text{Náhodne vyberieme naraz dva lístky.}\\
     &\text{Aká je pravdepodobnosť, že čísla na vytiahnutých lístkoch}\\
     &\quad\text{sa líšia o viac ako 2?} \\
    &\textbf{Odpoveď zapíšte ako zlomok.}
   \end{aligned}',
   3,
   '7/12',
   '["Zisti, koľko dvojíc čísel sa dá vybrať zo 9 lístkov - to je počet všetkých možností.", "Prejdi si všetky dvojice a spočítaj, koľko z nich sa líši o viac ako 2.", "Pravdepodobnosť je počet vyhovujúcich dvojíc delený všetkými možnosťami."]'
  );

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'medium',
   '\begin{aligned}
     &\text{V škatuli je 9 lístkov očíslovaných číslami }1,2,3,\dots,9.\\
     &\text{Náhodne vyberieme naraz dva lístky.}\\
     &\text{Aká je pravdepodobnosť, že súčet čísel na vytiahnutých lístkoch}\\
     &\quad\text{je aspoň 7?} \\
    &\textbf{Odpoveď zapíšte ako zlomok.}
   \end{aligned}',
   3,
   '5/6',
   '["Zisti, koľko dvojíc čísel sa dá vybrať zo 9 lístkov - to je počet všetkých možností.", "Prejdi všetky dvojice a spočítaj, pri ktorých je ich súčet aspoň 7.", "Pravdepodobnosť je počet týchto dvojíc delený všetkými možnosťami."]'
  );

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'medium',
   '\begin{aligned}
     &\text{V škatuli je 9 lístkov očíslovaných číslami }1,2,3,\dots,9.\\
     &\text{Náhodne vyberieme naraz dva lístky.}\\
     &\text{Aká je pravdepodobnosť, že súčet čísel na vytiahnutých lístkoch}\\
     &\quad\text{je aspoň 9?} \\
    &\textbf{Odpoveď zapíšte ako zlomok.}
   \end{aligned}',
   3,
   '3/4',
   '["Zisti celkový počet dvojíc, ktoré sa dajú vybrať z 9 lístkov - je to kombinácia C(9,2).", "Prejdi všetky dvojice a vyber tie, ktorých súčet je aspoň 9.", "Pravdepodobnosť je počet týchto dvojíc delený celkovým počtom možností."]'
  );

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'medium',
   '\begin{aligned}
     &\text{V škatuli máme 100 výrobkov a medzi nimi 10 nepodarok.}\\
     &\text{Náhodne vyberieme 20 (bez vrátenia) a zistíme, že medzi}\\
     &\quad\text{vybranými je jeden nepodarok. S akou pravdepodobnosťou}\\
     &\quad\text{medzi ďalšími desiatimi náhodne vybranými (opäť bez vrátenia)}\\
     &\quad\text{nie je nepodarok?} \\
    &\textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na šesť desatinných miest.}
   \end{aligned}',
   3,
   '0.280437',
   '["Zo 100 výrobkov je 10 nepodarkov, takže po výbere 20, kde bol 1 nepodarok, ostáva 9 nepodarkov a 71 dobrých.", "Ďalších 10 výrobkov vyberáš zo zvyšných 80, a chceš, aby medzi nimi nebol žiadny nepodarok.", "Spočítaj pravdepodobnosť, že všetkých 10 vybraných bude z 71 dobrých - je to kombinácia dobrých nad 10 delená kombináciou zvyšných 80 nad 10."]'
  );

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'medium',
   '\begin{aligned}
     &\text{V škatuli máme 100 výrobkov a medzi nimi 10 nepodarok.}\\
     &\text{Náhodne vyberieme 20 (bez vrátenia) a zistíme, že medzi}\\
     &\quad\text{vybranými je jeden nepodarok. S akou pravdepodobnosťou}\\
     &\quad\text{medzi ďalšími desiatimi náhodne vybranými (opäť bez vrátenia)}\\
     &\quad\text{je práve jeden nepodarok?}\\
    &\textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na šesť desatinných miest.}
   \end{aligned}',
   3,
   '0.407087',
   '["Po prvom výbere zostáva v škatuli 80 výrobkov, z toho 9 nepodarkov a 71 dobrých.",
    "Chceme, aby v ďalších 10 kusoch bol presne jeden nepodarok a zvyšných 9 bolo dobrých.",
     "Použi hypergeometrické rozdelenie: spočítaj kombinácie pre výber 1 z 9 a 9 z 71, potom vydel celkovým počtom možností - kombináciou 80 nad 10."]'
  );

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'medium',
   '\begin{aligned}
     &\text{V škatuli máme 100 výrobkov a medzi nimi 10 nepodarok.}\\
     &\text{Náhodne vyberieme 20 (bez vrátenia) a zistíme, že medzi}\\
     &\quad\text{vybranými je jeden nepodarok. S akou pravdepodobnosťou}\\
     &\quad\text{medzi ďalšími desiatimi náhodne vybranými (opäť bez vrátenia)}\\
     &\quad\text{budú dva nepodarky?} \\
    &\textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na šesť desatinných miest.}
   \end{aligned}',
   3,
   '0.232621',
   '["Po prvom výbere ostáva v škatuli 80 výrobkov, z toho 9 nepodarkov a 71 dobrých.", 
   "Chceme, aby medzi ďalšími 10 vybranými boli presne 2 nepodarky a 8 dobrých.", 
   "Použi hypergeometrické rozdelenie: spočítaj kombinácie 9 nad 2 a 71 nad 8, a vydel ich celkovou kombináciou 80 nad 10."]'
  );

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (0, 'medium',
   '\begin{aligned}
     &\text{V škatuli máme 100 výrobkov a medzi nimi 10 nepodarok.}\\
     &\text{Náhodne vyberieme 20 (bez vrátenia) a zistíme, že medzi}\\
     &\quad\text{vybranými je jeden nepodarok. S akou pravdepodobnosťou}\\
     &\quad\text{medzi ďalšími desiatimi náhodne vybranými (opäť bez vrátenia)}\\
     &\quad\text{budú najviac dva nepodarky?} \\
    &\textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na šesť desatinných miest.}
   \end{aligned}',
   3,
   '0.920145',
   '["Po prvom výbere zostáva 80 výrobkov, z toho 9 nepodarkov a 71 dobrých.", 
   "Potrebujeme, aby medzi ďalšími 10 vybranými boli 0, 1 alebo 2 nepodarky.", 
   "Spočítaj pravdepodobnosti pre 0, 1 a 2 nepodarky pomocou hypergeometrického rozdelenia a výsledky sčítaj."]'
  );

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (1, 'easy',
   '\begin{aligned}
    &\text{Produkcia je tvorená tromi automatickými linkami, ktoré sa}\\
    &\text{podelia na celkovej produkcii (po rade) 50%, 30%, resp. 20%.}\\
    &\text{Nepodarkovosť jednotlivých liniek je rovná (po rade) 2%, 3%, resp. 4%.}\\
    &\text{Aká je nepodarkovosť celej produkcie?}\\
    &\textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na tri desatiné miesta.}
   \end{aligned}',
   3,
   '0.027',
    '["Linka 1 vyrába 50 % produktov, z nich 2 % sú nepodarky ⇒ jej príspevok je 0.5 × 0.02.",
      "Linka 2 vyrába 30 % produktov, z nich 3 % sú nepodarky ⇒ jej príspevok je 0.3 × 0.03.",
      "Linka 3 vyrába 20 % produktov, z nich 4 % sú nepodarky ⇒ jej príspevok je 0.2 × 0.04.", 
      "Súčet týchto troch je celková nepodarkovosť."]'
  );

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (1, 'medium',
   '\begin{aligned}
    &\text{Produkcia je tvorená tromi automatickými linkami, ktoré sa}\\
    &\text{podelia na celkovej produkcii (po rade) 50%, 30%, resp. 20%.}\\
    &\text{Nepodarkovosť jednotlivých liniek je rovná (po rade) 2%, 3%, resp. 4%.}\\
    &\text{Nech náhodne vybraný výrobok je nepodarok. Aká je pravdepodobnosť,}\\
    &\text{že bol vyrobený treťou linkou?} \\
    & \textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na štyri desatinné miesta.}
   \end{aligned}',
   3,
   '0.2963',
   '["Linka 1 vyrába 50 % produktov, z nich 2 % sú nepodarky ⇒ jej príspevok je 0.5 × 0.02.",
    "Linka 2 vyrába 30 % produktov, z nich 3 % sú nepodarky ⇒ jej príspevok je 0.3 × 0.03.",
     "Linka 3 vyrába 20 % produktov, z nich 4 % sú nepodarky ⇒ jej príspevok je 0.2 × 0.04.", 
     "Súčet týchto troch je celková nepodarkovosť."]'
  );

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (1, 'medium',
   '\begin{aligned}
    &\text{Študent odpovedá formou testu, v ktorom ku každej otázke má ponúknutých 7 alternatívnych odpovedí.}\\
    &\text{Ak má danú otázku naštudovanú, vyberá s istotou správnu odpoveď.}\\
    &\text{V opačnom prípade náhodne volí jednu z ponúkaných odpovedí.}\\
    &\text{Predpokladajme, že pravdepodobnosť uhádnutia správnej odpovede je 1/7.}\\
    &\text{Nakoniec predpokladajme, že študent naštudoval 70% určenej látky.}\\
    &\text{Aká je pravdepodobnosť, že na náhodne zvolenej otázke študent odpovie správne?}\\
    &\textbf{Odpoveď zapíšte ako zlomok.}
   \end{aligned}',
   3,
   '52/70',
   '["Študent má 70 % pravdepodobnosť, že otázku ovláda - vtedy odpovie určite správne.",
    "V 30 % prípadov tipuje, a vtedy má šancu 1/7 na správnu odpoveď.",
    "Vypočítaj celkovú pravdepodobnosť ako súčet: 0.7 × 1 + 0.3 × (1/7)."]'
  );

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  (1, 'medium',
   '\begin{aligned}
    &\text{Študent odpovedá formou testu, v ktorom ku každej otázke má ponúknutých 7 alternatívnych odpovedí.}\\
    &\text{Ak má danú otázku naštudovanú, vyberá s istotou správnu odpoveď.}\\
    &\text{V opačnom prípade náhodne volí jednu z ponúkaných odpovedí.}\\
    &\text{Predpokladajme, že pravdepodobnosť uhádnutia správnej odpovede je 1/7.}\\
    &\text{Nakoniec predpokladajme, že študent naštudoval 70% určenej látky.}\\
    &\text{Ak študent dal správnu odpoveď, s akou pravdepodobnosťou nehádal?}\\
    &\textbf{Odpoveď zapíšte ako zlomok.}
   \end{aligned}',
   3,
   '49/52',
   '["Použi Bayesovu vetu: zaujíma nás pravdepodobnosť, že otázku vedel, ak odpovedal správne.", 
   "V čitateli bude pravdepodobnosť, že vedel a odpovedal správne: 0.7 × 1.", 
   "V menovateli bude celková pravdepodobnosť správnej odpovede: 0.7 × 1 + 0.3 × (1/7)."]'
  );



-- ========================================

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
  -- 1.5.10 a) Pravdepodobnosť, že zariadenie hlási zmenu
  (1, 'medium',
   '\begin{aligned}
    &\text{Diagnostické zariadenie registruje zmenu vo výrobnom procese – ak o zmene}\\
    &\text{skutočne ide – s pravdepodobnosťou 0.99. Na druhej strane hlási zmenu}\\
    &\text{s pravdepodobnosťou 0.05 aj v prípadoch, keď k zmene v skutočnosti nedôjde.}\\
    &\text{Predpokladajme, že pravdepodobnosť zmien vo výrobnom procese je 0.05.}\\
    &\text{Aká je pravdepodobnosť toho, že zariadenie hlási zmenu?}\\
    & \textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na tri desatinné miesta.}
   \end{aligned}',
   3,
   '0.097',
   '["Použi zákon úplnej pravdepodobnosti: hlásenie môže vzniknúť pri skutočnej zmene aj pri falošnom poplachu.",
    "Spočítaj: 0.05 × 0.99 (správne hlásenie pri zmene) + 0.95 × 0.05 (falošné hlásenie pri nezmene).",
    "Súčet týchto dvoch pravdepodobností je celková pravdepodobnosť, že zariadenie hlási zmenu."]'
  ),
  -- 1.5.10 b) Pravdepodobnosť, že pri hlásení zmeny skutočne došlo k zmene
  (1, 'medium',
   '\begin{aligned}
    &\text{Diagnostické zariadenie registruje zmenu vo výrobnom procese – ak o zmene}\\
    &\text{skutočne ide – s pravdepodobnosťou 0.99. Na druhej strane hlási zmenu}\\
    &\text{s pravdepodobnosťou 0.05 aj v prípadoch, keď k zmene v skutočnosti nedôjde.}\\
    &\text{Predpokladajme, že pravdepodobnosť zmien vo výrobnom procese je 0.05.}\\
    &\text{Predpokladajme, že zariadenie hlási zmenu. S akou pravdepodobnosťou}\\
    &\text{ide skutočne o zmenu vo výrobnom procese?} \\
    & \textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na tri desatinné miesta.}
   \end{aligned}',
   3,
   '0.510',
   '["Použi Bayesovu vetu: chceme pravdepodobnosť, že zmena nastala, ak zariadenie hlási zmenu.", 
   "V čitateli bude: 0.05 × 0.99 (pravdepodobnosť, že zmena nastala a bola zachytená).", 
   "V menovateli bude celková pravdepodobnosť hlásenia zmeny: 0.05 × 0.99 + 0.95 × 0.05."]'
  );



-- =========================================
-- Ulohy od Nanasiovej

--Teoria pravdepodobnosti

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
(3, 'easy',
 '\begin{aligned}
  &\text{Nech množina }A=\{1,2,3\}\text{ a }\Omega\text{ je množina všetkých}\\
  &\text{trojciferných čísel tvorených prvkami }A.\\
  &\text{Koľko prvkov má množina }\Omega?
\end{aligned}',
 3, '27', '["Množina A obsahuje 3 čísla: 1, 2, 3.", 
 "Hľadáme všetky trojciferné čísla vytvorené z týchto číslic.",
  "Ak sa číslice môžu opakovať, počet všetkých takých čísel je 3 × 3 × 3 = 27."]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
(3, 'easy',
 '\begin{aligned}
  &\text{Nech množina }A=\{1,2,3\}\text{ a }\Omega_1\text{ je množina}\\
  &\text{trojciferných čísel z }A,\text{ v ktorých sa každé číslo môže}\\
  &\text{použiť iba raz.}\\
  &\text{Koľko prvkov má množina }\Omega_1?
\end{aligned}',
 3, '6', '["Množina A obsahuje 3 čísla: 1, 2, 3.",
  "Tvoríme trojciferné čísla, v ktorých sa číslice neopakujú.",
  "Ide o počet permutácií troch prvkov: 3! = 3 × 2 × 1 = 6."]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
(3, 'easy',
 '\begin{aligned}
  &\text{Nech množina }A=\{1,2,3\}\text{ a }\Omega_2\text{ je množina}\\
  &\text{trojciferných čísel z }A,\text{ v ktorých čísla 2 a 3}\\
  &\text{sa môžu použiť iba raz (1 môže byť opakovane).}\\
  &\text{Koľko prvkov má množina }\Omega_2?
\end{aligned}',
 3, '13', '["Množina A obsahuje čísla 1, 2, 3 – pričom 1 sa môže opakovať, ale 2 a 3 len raz.",
  "Pre každý trojmiestny tvar treba zvoliť pozície pre čísla 2 a 3 (0, 1 alebo 2 z nich použiť), zvyšné miesta doplniť jednotkami.", 
 "Spočítaj všetky možné usporiadania: s 0, 1 alebo 2 výskytmi číslic 2 alebo 3 a zvyšok doplň číslom 1."]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
(3, 'easy',
 '\begin{aligned}
  &\text{Máme udalosti }A\text{ a }B\text{. Nech }P(A)=0{,}3,\;P(B)=0{,}6\\
  &\text{a nech }0 \le P(A\cap B) \le 0{,}5.\\
  &\text{Môžu byť }A,B\text{ navzájom nezávislé?}\\
  &\mathbf{Odpoveď\ zapíšte\ ako\ ano\ /\ nie.}
\end{aligned}',
 2, 'ano', '["Pre nezávislé udalosti platí: P(A ∩ B) = P(A) × P(B).", 
 "Vypočítaj tento súčin: 0,3 × 0,6 = 0,18.", 
 "Hodnota 0,18 spadá do povoleného intervalu pre P(A ∩ B) (0 až 0,5), takže nezávislosť je možná."]');

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
(3, 'easy',
 '\begin{aligned}
  &\text{V urne je 10 loptíčok, z ktorých 5 má označenie 1 a zvyšné}\\
  &\text{majú označenia }2,3,4,5,6.\\
  &\text{Ťaháme postupne po jednej loptíčke bez vrátenia,}\\
  &\text{opakujeme, kým urna nie je prázdna.}\\
  &\text{Aká je pravdepodobnosť, že ich vytiahneme v poradí}\\
  &1,3,2,4,5,6,1,1,1,1?\\
  &\mathbf{Odpoveď\ zapíšte\ ako\ zlomok.}
\end{aligned}',
 1, '1/30240', '["Všetky loptíčky sú rozlíšiteľné podľa čísla, no 5 z nich má rovnaké označenie 1.", 
 "Počet všetkých možných usporiadaní týchto 10 lôpt je 10! / 5! (kvôli piatim rovnakým jednotkám).", 
 "Počet priaznivých usporiadaní je len 1 (konkrétny daný sled), takže pravdepodobnosť je 1 / (10! / 5!) = 5! / 10!."]'),
(3, 'easy',
 '\\begin{aligned}
 &\\text{V urne je 12 loptíčok označených }1,2,3,\\text{ tak, že 5 z nich}\\
 &\\text{je označených }1, 4\\text{ je označených }2\\text{ a zvyšné }3.\\
 &\\text{Ťaháme postupne po jednej loptíčke bez vrátenia,}\\
 &\\text{opakujeme, kým urna nie je prázdna.}\\
 &\\text{Aká je pravdepodobnosť, že ich vytiahneme v poradí}\\
 &1,2,2,2,3,1,1,1,1,3,3? \\
    &\textbf{Odpoveď zapíšte ako zlomok.}
 \\end{aligned}',
 1, '1/27720', '["Spočítaj, koľko lôpt je označených každým číslom: 5× jednotka, 4× dvojka, 3× trojka.",
  "Celkový počet rôznych usporiadaní týchto 12 lôpt je 12! / (5!·4!·3!).", 
 "Počet priaznivých usporiadaní (dané konkrétne poradie) je len 1, takže pravdepodobnosť je 1 / (12! / (5!·4!·3!)) = (5!·4!·3!) / 12!."]'),
(3, 'easy',
 '\begin{aligned}
  &\text{V urne je 12 loptíčok označených }1,2,3,\text{ tak, že 5 z nich}\\
  &\quad\text{je označených }1,\;4\text{ je označených }2\text{ a zvyšné }3.\\
  &\text{Ťaháme postupne po jednej loptíčke bez vrátenia,}\\
  &\quad\text{opakujeme 4-krát.}\\
  &\text{Aká je pravdepodobnosť, že všetky budú označené }1?\\
  &\mathbf{Odpoveď\ zapíšte\ ako\ zlomok.}
\end{aligned}',
 1, '5/495', '["Loptičiek s označením 1 je 5 z celkových 12.",
  "Pri ťahaní bez vrátenia sa pravdepodobnosť mení pri každom kroku.", 
 "Spočítaj pravdepodobnosť ako súčin: 5/12 × 4/11 × 3/10 × 2/9."]');



 -- =========================================
-- Nahodna premenna a rozdelenia

INSERT INTO exercises (theme_id, difficulty_level, description, points, correct_answer, hints) VALUES
(2, 'easy',
 '\begin{aligned}
  &\text{Je známe, že 25% obyvateľstva sú ľaváci.}\\
  &\text{Na seminári s 30 účastníkmi.}\\
  &\text{Aká je pravdepodobnosť, že najviac traja sú ľaváci?}\\
  &\textbf{Odpoveď zapíšte ako desatinné číslo zaokrúhlené na päť desatinných miest.}
\end{aligned}',
 1, '0.03745', '["Úloha má charakter binomického rozdelenia: počet ľavákov z 30 účastníkov, kde pravdepodobnosť ľaváka je 0,25.", 
 "Počet úspechov (ľavákov) má teda rozdelenie Bi(n=30, p=0,25).", 
 "Hľadáme pravdepodobnosť, že ich bude najviac 3 – teda P(X ≤ 3), čo je súčet pravdepodobností pre 0, 1, 2 a 3 ľavákov."]');


