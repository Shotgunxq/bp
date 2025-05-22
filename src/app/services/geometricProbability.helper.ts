// Define interface for geometric distribution exercise
export interface GeometricExercise {
  k: number; // trial on which first success occurs
  p: number; // success probability in each trial
  probability: number; // the raw computed probability
  description: string; // problem statement (LaTeX)
  correct_answer: number; // rounded to 3 decimals
  points: number;
  hints: string[];
}

// Generate one or more geometric‐distribution exercises
export function geometricProbabilityRandom(): GeometricExercise[] {
  const exercises: GeometricExercise[] = [];
  const numberOfExercises = 1; // adjust as needed

  for (let i = 0; i < numberOfExercises; i++) {
    // Random p between 0.01 and 0.99
    const p = parseFloat((Math.random() * 0.98 + 0.01).toFixed(2));
    // Random k between 2 and 5
    const k = Math.floor(Math.random() * 4) + 2;

    // Compute P(X = k) = (1 - p)^(k-1) * p
    const rawProb = calculateGeometricProbability(k, p);
    const correct = parseFloat(rawProb.toFixed(3));

    const description = generateDescription(k, p);

    const hints = [
      'Použi geometrické rozdelenie – modeluje počet pokusov do prvého úspechu.',
      'Pravdepodobnosť, že prvý úspech nastane až na ${p}. pokus, je (1 - ${k}) na ${p - 1} * ${k}.',
      'Výsledok vypočítaj a zaokrúhli na 4 desatinné miesta.',
    ];
    exercises.push({
      k,
      p,
      probability: rawProb,
      description,
      correct_answer: correct,
      points: 3,
      hints,
    });
  }

  return exercises;
}

// First-success-on-kth-trial probability
function calculateGeometricProbability(k: number, p: number): number {
  return Math.pow(1 - p, k - 1) * p;
}

// Build the LaTeX description
function generateDescription(k: number, p: number): string {
  return `\\begin{aligned}
&\\text{Mikrokontrolér opakovane odosiela dátový paket cez sériovú linku,}\\\\
&\\text{kde pravdepodobnosť úspešného prenosu je } p = ${p}.\\\\
&\\text{Aká je pravdepodobnosť, že prvý úspešný prenos nastane až na } k = ${k}\\text{. pokus?}
\\end{aligned}`;
}
